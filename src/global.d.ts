// should be in .d.ts files

// primarily for Array.isArray to fix inference from any[], to unknown[]
import "@total-typescript/ts-reset";

// forward generics for forwardRef
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/#option-2---redeclare-forwardref
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
