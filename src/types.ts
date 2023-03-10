export interface Options {
  types: {
    [type: string]: string;
  };
  defaultType: string;
  defaultSubject: string;
  defaultBody: string;
  maxHeaderWidth: number;
  maxLineWidth: number;
}
