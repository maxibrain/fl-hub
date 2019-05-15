declare namespace Upwork {
  type UpworkError = any;
  type VoidCallback = (error?: UpworkError) => void;
  type ResultCallback<T = any> = (error?: UpworkError, result?: T) => void;
}
