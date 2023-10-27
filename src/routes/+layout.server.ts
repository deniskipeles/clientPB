/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, fetch }) => {
    try {
        const { pb, ...rest } = locals;
        // console.log(res,rest)
        return {
            ...rest
        };
        
    } catch (error) {
        console.error(`Error in load function for : ${error}`);
		return {};
    }
};
