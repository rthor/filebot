import {exec} from 'child_process'
import args from './util/args'
import path from 'path'

const qRx = /Auto\-detected query: \[(.+)\]/;
const skippedRx = /.+\] because \[(.+)\]/;
const renamedRx = /.+\] to \[(.+)\]/;

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
  static rename(config, cb) {
    let command = `filebot -rename ${path.normalize(config.path)} ${args(config)}`;
    let res = {query: undefined, renamed: [], skipped: []};

    return new Promise(resolve => {
      let child = exec(command);

      child.stdout.on('data', chunck => {
        if (!res.query && qRx.test(chunck))
          res.query = qRx.exec(chunck)[1];
        else if (skippedRx.test(chunck))
          res.skipped.push(path.basename(skippedRx.exec(chunck)[1]));
        else if (renamedRx.test(chunck))
          res.renamed.push(path.basename(renamedRx.exec(chunck)[1]));
      });

      child.stdout.on('close', () => cb ? cb(res) : resolve(res));
    });
  }
}

export default FileBot;
