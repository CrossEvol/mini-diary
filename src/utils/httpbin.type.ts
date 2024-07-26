export type HttpBinGetResult = {
    args:    Args;
    headers: Headers;
    origin:  string;
    url:     string;
}

export type Args = {
}

export type Headers = Record<string, string>;

export type HTTPBinPostResult = {
    args:    Args;
    data:    string;
    files:   Args;
    form:    Args;
    headers: Headers;
    json:    null;
    origin:  string;
    url:     string;
}