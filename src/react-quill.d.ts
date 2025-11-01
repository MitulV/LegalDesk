/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-quill' {
  import { Component } from 'react';

  export interface ReactQuillProps {
    id?: string;
    className?: string;
    theme?: string;
    value?: string | any;
    defaultValue?: string | any;
    placeholder?: string;
    bounds?: string | HTMLElement;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    onChangeSelection?: (range: any, source: any, editor: any) => void;
    onFocus?: (selection: any, source: any, editor: any) => void;
    onBlur?: (previousSelection: any, source: any, editor: any) => void;
    onKeyPress?: any;
    onKeyDown?: any;
    onKeyUp?: any;
    readOnly?: boolean;
    modules?: any;
    formats?: string[];
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
  }
}

