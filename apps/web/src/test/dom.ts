import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!GlobalRegistrator.isRegistered) {
	GlobalRegistrator.register();
}

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
