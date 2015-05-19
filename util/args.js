import extend from 'extend'

const DEFAULTS = {
  db: 'TheTVDB',
  order: 'airdate',
  action: 'move',
  path: '.',
  lang: 'en',
  log: 'config',
  reqursive: false,
  strict: true
};

export default (options) => {
  options = extend(true, {}, DEFAULTS, options);
  let args = `--db ${options.db} --lang ${options.lang} --action ${options.action} --log ${options.log} --order ${options.order}`;

  if (options.reqursive) {args += ' -r'}
  if (!options.strict) {args += ' -non-strict'}

  return args;
};
