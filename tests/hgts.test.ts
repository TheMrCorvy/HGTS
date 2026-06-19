import { hgts } from "../src/index";
import { HGTSOptions } from "../src/types";

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Because HGTS is a singleton we must reset its internal state before every
 * test to ensure isolation.  We do this by calling setup() with the desired
 * fixture, which overwrites every mutable field.
 */
function setupHGTS(options: HGTSOptions): void {
    hgts.setup(options);
}

// ─── fixtures ───────────────────────────────────────────────────────────────

const baseResources: HGTSOptions["resources"] = {
    en: {
        greeting: "Hello, {{name}}!",
        farewell: "Goodbye!",
        nested: {
            deep: {
                value: "Deep value",
            },
        },
        items: {
            zero: "No items",
            one: "{{count}} item",
            other: "{{count}} items",
        },
        onlyOther: {
            other: "{{count}} things",
        },
    },
    es: {
        greeting: "¡Hola, {{name}}!",
        farewell: "¡Adiós!",
    },
    ja: {
        greeting: "こんにちは、{{name}}！",
    },
    ar: {
        camels: {
            zero: "لا جمال",
            one: "جمل واحد",
            two: "جملان",
            few: "{{count}} جمال قليلة",
            many: "{{count}} جمالاً كثيرة",
            other: "{{count}} جمل",
        },
    },
};

// ─── setup / teardown ───────────────────────────────────────────────────────

beforeEach(() => {
    setupHGTS({
        resources: baseResources,
        defaultLocale: "en",
        fallbackLocale: "en",
    });
});

// ─── getInstance / singleton ─────────────────────────────────────────────────

describe("HGTS singleton", () => {
    it("always returns the same instance", () => {
        // We can only access the instance via the exported `hgts` constant, but
        // we can verify identity by checking that mutations on it are visible
        // from a separate import reference.
        const { hgts: hgts2 } = require("../src/index");
        expect(hgts).toBe(hgts2);
    });
});

// ─── setup() ────────────────────────────────────────────────────────────────

describe("setup()", () => {
    it("sets the current locale to defaultLocale", () => {
        setupHGTS({ resources: baseResources, defaultLocale: "es" });
        expect(hgts.getLanguage()).toBe("es");
    });

    it("defaults defaultLocale to 'en' when not provided", () => {
        setupHGTS({ resources: baseResources });
        expect(hgts.getLanguage()).toBe("en");
    });

    it("defaults fallbackLocale to defaultLocale when not provided", () => {
        // verify fallback kicks in: remove a key from 'es' and change to es
        setupHGTS({ resources: baseResources, defaultLocale: "es" });
        hgts.changeLanguage("es");
        // 'nested.deep.value' only exists in 'en'; with fallback = defaultLocale = 'es'
        // it should NOT fall back to 'en' here — returns the key
        expect(hgts.t("nested.deep.value")).toBe("nested.deep.value");
    });
});

// ─── getLanguage() ───────────────────────────────────────────────────────────

describe("getLanguage()", () => {
    it("returns the current locale", () => {
        expect(hgts.getLanguage()).toBe("en");
    });
});

// ─── getAvailableLanguages() ─────────────────────────────────────────────────

describe("getAvailableLanguages()", () => {
    it("returns all locale keys defined in resources", () => {
        const langs = hgts.getAvailableLanguages();
        expect(langs).toContain("en");
        expect(langs).toContain("es");
        expect(langs).toContain("ja");
        expect(langs).toContain("ar");
        expect(langs).toHaveLength(4);
    });
});

// ─── changeLanguage() ────────────────────────────────────────────────────────

describe("changeLanguage()", () => {
    it("changes the current locale successfully", () => {
        hgts.changeLanguage("es");
        expect(hgts.getLanguage()).toBe("es");
    });

    it("throws when the locale is not in resources", () => {
        expect(() => hgts.changeLanguage("fr")).toThrow(
            /Language "fr" not found/
        );
    });

    it("error message lists available languages", () => {
        expect(() => hgts.changeLanguage("zz")).toThrow(/Available languages/);
    });
});

// ─── t() — basic translation ──────────────────────────────────────────────────

describe("t() — basic translation", () => {
    it("returns the translated string for a known key", () => {
        expect(hgts.t("farewell")).toBe("Goodbye!");
    });

    it("returns the key itself when the key is not found", () => {
        expect(hgts.t("nonexistent.key")).toBe("nonexistent.key");
    });

    it("returns the key when the current locale has no resources at all", () => {
        setupHGTS({
            resources: { ghost: {} },
            defaultLocale: "ghost",
            fallbackLocale: "ghost",
        });
        expect(hgts.t("anything")).toBe("anything");
    });
});

// ─── t() — nested keys ───────────────────────────────────────────────────────

describe("t() — nested (dot-notation) keys", () => {
    it("resolves a two-level nested key", () => {
        expect(hgts.t("nested.deep.value")).toBe("Deep value");
    });

    it("returns the key for a partial path that resolves to an object (not a string)", () => {
        expect(hgts.t("nested.deep")).toBe("nested.deep");
    });

    it("returns the key when an intermediate segment is missing", () => {
        expect(hgts.t("nested.missing.value")).toBe("nested.missing.value");
    });
});

// ─── t() — interpolation ─────────────────────────────────────────────────────

describe("t() — variable interpolation", () => {
    it("replaces {{name}} placeholder with the provided value", () => {
        expect(hgts.t("greeting", { name: "World" })).toBe("Hello, World!");
    });

    it("leaves the placeholder unchanged when the param key is missing", () => {
        expect(hgts.t("greeting")).toBe("Hello, {{name}}!");
    });

    it("supports numeric values as interpolation params", () => {
        setupHGTS({
            resources: { en: { score: "Score: {{value}}" } },
            defaultLocale: "en",
        });
        expect(hgts.t("score", { value: 42 })).toBe("Score: 42");
    });

    it("leaves unknown placeholders untouched", () => {
        // greeting has {{name}}, passing a different key keeps the placeholder
        expect(hgts.t("greeting", { surname: "Doe" })).toBe(
            "Hello, {{name}}!"
        );
    });
});

// ─── t() — pluralization ─────────────────────────────────────────────────────

describe("t() — pluralization", () => {
    it("resolves to 'other' form for count 0 in English (Intl.PluralRules behavior)", () => {
        // Intl.PluralRules('en').select(0) === 'other' in English per CLDR;
        // the 'zero' form is NOT automatically selected for English.
        expect(hgts.t("items", { count: 0 })).toBe("0 items");
    });

    it("uses 'zero' form when count is 0 and a custom pluralRule is provided", () => {
        setupHGTS({
            resources: baseResources,
            defaultLocale: "en",
            fallbackLocale: "en",
            pluralRule: (count) => (count === 0 ? "zero" : count === 1 ? "one" : "other"),
        });
        expect(hgts.t("items", { count: 0 })).toBe("No items");
    });

    it("uses 'one' form when count is 1", () => {
        expect(hgts.t("items", { count: 1 })).toBe("1 item");
    });

    it("uses 'other' form when count > 1", () => {
        expect(hgts.t("items", { count: 5 })).toBe("5 items");
    });

    it("interpolates {{count}} within the plural string", () => {
        expect(hgts.t("items", { count: 42 })).toBe("42 items");
    });

    it("falls back to 'other' when specific form is absent", () => {
        // 'onlyOther' has only 'other', so zero/one should both fall back to it
        expect(hgts.t("onlyOther", { count: 0 })).toBe("0 things");
        expect(hgts.t("onlyOther", { count: 1 })).toBe("1 things");
    });
});

// ─── t() — custom plural rule ─────────────────────────────────────────────────

describe("t() — custom pluralRule", () => {
    it("uses the custom rule instead of Intl.PluralRules", () => {
        setupHGTS({
            resources: {
                en: {
                    cats: {
                        one: "one cat",
                        other: "many cats",
                    },
                },
            },
            defaultLocale: "en",
            // Always return 'one', regardless of the actual count
            pluralRule: (_count, _locale) => "one",
        });

        expect(hgts.t("cats", { count: 99 })).toBe("one cat");
        expect(hgts.t("cats", { count: 0 })).toBe("one cat");
    });
});

// ─── t() — Arabic plural forms (Intl.PluralRules) ────────────────────────────

describe("t() — Arabic plural forms via Intl.PluralRules", () => {
    beforeEach(() => {
        setupHGTS({
            resources: baseResources,
            defaultLocale: "ar",
            fallbackLocale: "ar",
        });
    });

    it("resolves 'zero' for 0 in Arabic", () => {
        expect(hgts.t("camels", { count: 0 })).toBe("لا جمال");
    });

    it("resolves 'one' for 1 in Arabic", () => {
        expect(hgts.t("camels", { count: 1 })).toBe("جمل واحد");
    });

    it("resolves 'two' for 2 in Arabic", () => {
        expect(hgts.t("camels", { count: 2 })).toBe("جملان");
    });
});

// ─── t() — fallback locale ────────────────────────────────────────────────────

describe("t() — fallback locale", () => {
    it("falls back to fallbackLocale when key is missing in currentLocale", () => {
        setupHGTS({
            resources: baseResources,
            defaultLocale: "es",
            fallbackLocale: "en",
        });
        // 'nested.deep.value' only exists in 'en'
        expect(hgts.t("nested.deep.value")).toBe("Deep value");
    });

    it("does not fall back when current locale equals fallbackLocale", () => {
        setupHGTS({
            resources: baseResources,
            defaultLocale: "es",
            fallbackLocale: "es",
        });
        expect(hgts.t("nested.deep.value")).toBe("nested.deep.value");
    });

    it("returns the key when neither locale nor fallback has the key", () => {
        setupHGTS({
            resources: baseResources,
            defaultLocale: "ja",
            fallbackLocale: "ja",
        });
        expect(hgts.t("farewell")).toBe("farewell");
    });
});

// ─── multi-language workflow ──────────────────────────────────────────────────

describe("multi-language workflow", () => {
    it("translates correctly after switching languages", () => {
        expect(hgts.t("greeting", { name: "Alice" })).toBe("Hello, Alice!");
        hgts.changeLanguage("es");
        expect(hgts.t("greeting", { name: "Alice" })).toBe("¡Hola, Alice!");
        hgts.changeLanguage("ja");
        expect(hgts.t("greeting", { name: "Alice" })).toBe(
            "こんにちは、Alice！"
        );
    });

    it("getLanguage() updates after changeLanguage()", () => {
        hgts.changeLanguage("es");
        expect(hgts.getLanguage()).toBe("es");
        hgts.changeLanguage("en");
        expect(hgts.getLanguage()).toBe("en");
    });
});
