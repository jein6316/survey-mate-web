type UrlConstantsType = {
    HOME: string;
    GROUP: {
        INFO: string;
        EDIT: string;
    };
};

export const urlConstants: Readonly<UrlConstantsType> = Object.freeze({
    HOME: "/",
    GROUP: {
        INFO: "/group/info",
        EDIT: "/group/edit",
    },
});
