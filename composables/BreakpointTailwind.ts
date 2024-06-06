import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const useBreakpointTailwind = () => {
    return useBreakpoints(breakpointsTailwind);
};
