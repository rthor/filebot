import {exec} from 'child_process'
import args from './util/args'
import path from 'path'

const qRx = /Auto\-detected query: \[(.+)\]/;
const skippedRx = /.+\] because \[(.+)\]/;
const renamedRx = /.+\] to \[(.+)\]/;
const subRx = /Writing \[.+\] to \[(.+)\]/;

/**
 * FileBot node wrapper.
 */
class FileBot {
  /**
   * Rename media files
   * @param config
   * @param cb
   * @returns {Promise} if no callback is provided.
   */
  static getSubtitles(config, cb) {
    let command = `filebot -get-missing-subtitles ${path.normalize(config.path)}`;
    let res = {message: undefined, fetched: []};

    return new Promise(resolve => {
      let child = exec(command);

      child.stdout.on('data', chunk => {
        if (!res.message)
          res.message = chunk.split('\n')[0];
        else if (subRx.test(chunk))
          res.fetched.push(path.basename(subRx.exec(chunk)[1]));
      });

      child.stdout.on('close', () => cb ? cb(res) : resolve(res));
    });
  }

  /**
   * Rename media files
   * @param config
   * @param cb
   * @returns {Promise} if no callback is provided.
   */
  static rename(config, cb) {
    let command = `filebot -rename ${path.normalize(config.path)} ${args(config)}`;
    let res = {query: undefined, renamed: [], skipped: []};

    return new Promise(resolve => {
      let child = exec(command);

      child.stdout.on('data', chunk => {
        if (!res.query && qRx.test(chunk))
          res.query = qRx.exec(chunk)[1];
        else if (skippedRx.test(chunk))
          res.skipped.push(path.basename(skippedRx.exec(chunk)[1]));
        else if (renamedRx.test(chunk))
          res.renamed.push(path.basename(renamedRx.exec(chunk)[1]));
      });

      child.stdout.on('close', () => cb ? cb(res) : resolve(res));
    });
  }
}

export default FileBot;
