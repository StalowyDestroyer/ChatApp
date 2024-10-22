import "axios";

declare module "axios" {
  export interface AxiosError<T = ApiErrorObject> {
    response?: AxiosResponse<T>;
  }
}
