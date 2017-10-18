import * as replicationStream from 'pouchdb-replication-stream';
import * as globalChanges from 'couchdb-global-changes';
import * as pouchdb from 'pouchdb';
import * as settings from '../settings.json';
import * as streams from 'memory-streams';
import * as _ from 'lodash';
import * as pako from 'pako';
import S3 from './AWS';

const buckets = (<any>settings).buckets;
const BACKUP_TIMER: { [dbName: string]: number } = {};
const couchSettings = (<any>settings).couch;


function getCouchURL() {
	let host = `${couchSettings.host}:${couchSettings.port}`;

	return couchSettings.auth.enabled
	? `${couchSettings.protocol}://${couchSettings.username}:${couchSettings.password}@${host}`
	: `${couchSettings.protocol}://${host}`;
};


function feedGlobalChanges() {
    const DB_NAME_PREFIXS = [ 'presentation', 'interactivevideo' ];
    const DELAY = 60 * 1000; // one min
    const cURL = getCouchURL();
    const feed = globalChanges({ couch: cURL, since: 'now' });


    feed.on('db-change', (change) => {
        var dbName = change.db_name;

        _.forEach(DB_NAME_PREFIXS, (name) => {
            var regexp = new RegExp(`${name}_[a-z0-9]+$`, 'i');

            if (regexp.test(dbName)) {
                if (BACKUP_TIMER[dbName])
                    clearTimeout(BACKUP_TIMER[dbName]);

                BACKUP_TIMER[dbName] = setTimeout(makeDump.bind(this, dbName), DELAY);
            }
        });
    });

    feed.on('error', (err) => {
        console.error(err);
        console.trace()
    });

    console.log('start change tracking');
}

function makeDump(dbName: string) {
    const BUCKET = buckets.dumps;

    getZDumpDB(dbName)
        .then((zdump) => S3.putObject(
            { Bucket: BUCKET, Key: `${dbName}.gz`, Body: new Buffer(zdump, 'binary') },
            (err) => err
                ? console.log(`Upload error: ${err}`)
                : console.log(`Uploaded dump: ${dbName}`)
        ))
        .catch((err) => console.log(err.stack));
}

function getZDumpDB(dbName: string) {
    var writer = new streams.WritableStream();
    let auth = getCouchURL();
	let host = `${couchSettings.host}:${couchSettings.port}`;
    let params = couchSettings.auth.enabled ? { auth: auth } : {};

    var db = new pouchdb(`${couchSettings.protocol}://${host}/${dbName}`, params);
    return (db as any).zdump(writer);
}

pouchdb.plugin({
	zdump: function(stream, opts, cb) {
		return this
		.dump.apply(this, _.takeWhile([ stream, opts, cb]))
		.then((res) => pako.gzip(stream.toString(), { level: 9, to: 'string' }));
	}
});


pouchdb.plugin(replicationStream.plugin);
pouchdb.adapter('writableStream', replicationStream.adapters.writableStream);
feedGlobalChanges();
