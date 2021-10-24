type Err = Error | string;

export default function errorHandler(...args: any[]) {
  let errPrefix;
  let e;
  let stop = true;

  switch (args.length) {
    case 0:
      return;
    case 1:
      e = args[0];
      break;

    case 2:
      if (typeof args[1] === 'boolean') {
        e = args[0] as Err;
        stop = args[1] as boolean;
      } else {
        errPrefix = args[0];
        e = args[1];
      }
      break;

    case 3:
      errPrefix = args[0];
      e = args[1];
      stop = args[2];
      break;

    default:
      errPrefix = 'Internal Error';
      e = new Error("the arguments' length of error handler must be 2 or 3");
      stop = true;
      break;
  }

  if (e) {
    errPrefix ? console.error(errPrefix, e) : console.log(e);
    console.log(
      `\nclick to find solution: \nhttps://stackoverflow.com/search?q=${encodeURIComponent(
        e.message ? e.message : e
      )}`
    );

    if (stop) {
      process.exit(1);
    } else {
      throw e;
    }
  }
}
