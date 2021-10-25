/* eslint-disable no-console */
type Err = Error | string;

// TODO: 类型重载优化
export default function errorHandler(...args: any[]) {
  let errPrefix = '';
  let e: Err;
  let stack: string | undefined = '';
  let stop = true;

  switch (args.length) {
    case 0:
      // 没有 error 不处理
      return;
    case 1:
      e = args[0];
      break;

    case 2:
      if (typeof args[1] === 'boolean') {
        stop = args[1] as boolean;
        e = args[0];
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
      e = new Error("the arguments' length of error handler must be 2 or 3")
        .message;
      stop = true;
      break;
  }

  if (!e) {
    return;
  }

  const isErrorType = e instanceof Error;
  // 若 e 为 Error 则打平 message 和 stack
  stack = isErrorType ? (e as Error).stack : '';
  e = isErrorType ? (e as Error).message : e;
  errPrefix = errPrefix ? `${errPrefix}: ` : errPrefix;

  console.error(errPrefix, e, stack);
  console.log(
    `\nclick to find solution: \nhttps://stackoverflow.com/search?q=${encodeURIComponent(
      e as string
    )}`
  );

  if (stop) {
    process.exit(1);
  } else {
    // TODO: think about the workflow
    throw e;
  }
}
