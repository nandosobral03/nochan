export type HTTPError = {
    status: number;
    message: string;
}

export const HTTPError = (status: number, message: string): HTTPError => ({ status, message });

const isHTTPError = (e: unknown): e is HTTPError => {
    let basicValidation = typeof e === "object" && e !== null && "status" in e && "message" in e;
    let statusValidation = typeof (e as HTTPError).status === "number" && (e as HTTPError).status >= 100 && (e as HTTPError).status < 600;
    let messageValidation = typeof (e as HTTPError).message === "string";
    return basicValidation && statusValidation && messageValidation;
}

export const MapToHTTPError = (e: any): HTTPError => {
    if (isHTTPError(e)) {
        return e;
    }
    else {
        return HTTPError(500, e.message ?? "Internal Server Error");
    }
}
