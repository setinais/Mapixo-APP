export class ResponseModel<T>{
    constructor(responseElement: any) {
        this.message = responseElement['message']
        this.errors = responseElement['errors']
        this.data = responseElement['data']
    }

    message: string
    errors: boolean
    data: T
}
