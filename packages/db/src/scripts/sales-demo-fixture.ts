import type {
  PriceSheetContentLocale,
  PriceSheetItemTranslations,
  PriceSheetPublicSettings,
  PriceSheetTranslations,
} from "../schema";

type SalesDemoTheme = "amber" | "slate" | "stone";

interface SalesDemoPriceSheetItem {
  id: string;
  name: string;
  description: string;
  section: string;
  translations: PriceSheetItemTranslations;
  priceCents: number;
  position: number;
}

interface SalesDemoPriceSheetLead {
  id: string;
  contactName: string;
  companyOrBusinessName: string | null;
  email: string;
  phoneOrHandle: string | null;
  message: string;
  locale: PriceSheetContentLocale;
  createdAt: Date;
}

interface SalesDemoPriceSheet {
  id: string;
  title: string;
  description: string;
  translations: PriceSheetTranslations;
  publicSettings: PriceSheetPublicSettings;
  slug: string;
  currency: "AMD";
  locale: PriceSheetContentLocale;
  theme: SalesDemoTheme;
  status: "published";
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  items: SalesDemoPriceSheetItem[];
  leads: SalesDemoPriceSheetLead[];
}

export interface SalesDemoFixture {
  user: {
    id: string;
    email: string;
    name: string;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  subscription: {
    id: string;
    plan: string;
    provider: "manual";
    status: "active";
  };
  priceSheets: SalesDemoPriceSheet[];
}

const fixtureCreatedAt = new Date("2026-07-01T08:00:00.000Z");

export const salesDemoFixture: SalesDemoFixture = {
  user: {
    id: "07fb00aa-e0f4-46a4-b2d2-7af13f183185",
    email: "showcase@unitforge.example",
    name: "Unitforge Showcase",
  },
  workspace: {
    id: "6cc492fa-cf62-4028-94e6-8c7c5ac508ec",
    name: "Unitforge Armenia Showcase",
    slug: "unitforge-armenia-showcase",
  },
  subscription: {
    id: "4c88cef9-863d-4beb-9b6b-8ca2fdeff64f",
    plan: "studio",
    provider: "manual",
    status: "active",
  },
  priceSheets: [
    {
      id: "75bbe01c-f2cc-4c54-943e-ad6056348a10",
      title: "Arev Dental",
      description:
        "Семейная стоматология в центре Еревана. Стоимость фиксируем до начала лечения.",
      translations: {
        "en-US": {
          title: "Arev Dental",
          description:
            "Family dental care in central Yerevan. We confirm the price before treatment begins.",
        },
      },
      publicSettings: {
        presentationAppearance: "light",
        contactLabel: "Arev Dental",
        contactEmail: null,
        contactPhone: null,
        primaryCtaLabel: "Запись · Booking",
        secondaryCtaLabel: "Позвонить · Call",
        inquiryText:
          "Укажите услугу и удобное время. / Tell us which service and time work for you.",
        businessLocation: "Yerevan · Kentron",
        businessHours: "Mon–Sat · 09:00–19:00",
        businessResponseTime: null,
        businessNote:
          "Демонстрационные данные Unitforge — не отправляйте личную информацию. / Unitforge demo data — do not send personal information.",
        inquiryEnabled: false,
      },
      slug: "demo-arev-dental-yerevan",
      currency: "AMD",
      locale: "ru-RU",
      theme: "amber",
      status: "published",
      publishedAt: new Date("2026-07-02T08:30:00.000Z"),
      createdAt: fixtureCreatedAt,
      updatedAt: new Date("2026-07-15T09:20:00.000Z"),
      items: [
        {
          id: "54cb9909-8187-4bea-b9ae-ba45954e93c5",
          name: "Первичная консультация",
          description: "Осмотр, снимки при необходимости и план лечения.",
          section: "Диагностика",
          translations: {
            "en-US": {
              name: "Initial consultation",
              description:
                "Examination, imaging when needed, and a treatment plan.",
              section: "Diagnostics",
            },
          },
          priceCents: 1_200_000,
          position: 0,
        },
        {
          id: "e21792ae-c3f2-4e53-991e-52fefbbfeee4",
          name: "Профессиональная гигиена",
          description:
            "Удаление налета и камня, полировка и рекомендации по уходу.",
          section: "Профилактика",
          translations: {
            "en-US": {
              name: "Professional cleaning",
              description:
                "Plaque and tartar removal, polishing, and care guidance.",
              section: "Prevention",
            },
          },
          priceCents: 2_800_000,
          position: 1,
        },
        {
          id: "c667ce81-00bc-4655-91a2-13f83fbac5e1",
          name: "Лечение кариеса",
          description: "Композитная пломба и восстановление формы зуба.",
          section: "Лечение",
          translations: {
            "en-US": {
              name: "Cavity treatment",
              description:
                "Composite filling and restoration of the tooth shape.",
              section: "Treatment",
            },
          },
          priceCents: 3_500_000,
          position: 2,
        },
        {
          id: "05e1b42a-b969-49c1-9672-450c5143586b",
          name: "Художественная реставрация",
          description: "Эстетическое восстановление одного переднего зуба.",
          section: "Эстетика",
          translations: {
            "en-US": {
              name: "Aesthetic restoration",
              description: "Aesthetic restoration of one front tooth.",
              section: "Aesthetic care",
            },
          },
          priceCents: 4_800_000,
          position: 3,
        },
        {
          id: "f8c5b20d-7b91-4b28-8ae7-855883d557fe",
          name: "Кабинетное отбеливание",
          description: "Одна процедура с предварительной оценкой эмали.",
          section: "Эстетика",
          translations: {
            "en-US": {
              name: "In-office whitening",
              description: "One session with an enamel assessment beforehand.",
              section: "Aesthetic care",
            },
          },
          priceCents: 9_500_000,
          position: 4,
        },
        {
          id: "ad2624b9-eefe-4076-910a-d9bfc26623d9",
          name: "Керамическая коронка",
          description: "Диагностика, цифровой слепок и установка коронки.",
          section: "Ортопедия",
          translations: {
            "en-US": {
              name: "Ceramic crown",
              description:
                "Diagnostics, digital impression, and crown fitting.",
              section: "Restorative dentistry",
            },
          },
          priceCents: 14_500_000,
          position: 5,
        },
        {
          id: "e8f7f7bc-cfb6-4375-b4b8-e642e80a2d46",
          name: "Детский профилактический прием",
          description: "Осмотр, адаптация ребенка и рекомендации родителям.",
          section: "Детская стоматология",
          translations: {
            "en-US": {
              name: "Children’s preventive visit",
              description:
                "Examination, a gentle introduction, and guidance for parents.",
              section: "Children’s dentistry",
            },
          },
          priceCents: 1_800_000,
          position: 6,
        },
      ],
      leads: [
        {
          id: "e0a96d50-b747-4dde-8924-ba10286431f4",
          contactName: "Арман М.",
          companyOrBusinessName: null,
          email: "arman.m@inquiries.example",
          phoneOrHandle: "+374 00 000 201",
          message:
            "Хочу записаться на консультацию и гигиену в субботу после 14:00.",
          locale: "ru-RU",
          createdAt: new Date("2026-07-15T08:42:00.000Z"),
        },
        {
          id: "59defa13-cca6-4538-b00e-1f4a509a86ac",
          contactName: "Nare S.",
          companyOrBusinessName: null,
          email: "nare.s@inquiries.example",
          phoneOrHandle: "+374 00 000 202",
          message:
            "Could I book an initial consultation for two family members next week?",
          locale: "en-US",
          createdAt: new Date("2026-07-13T13:18:00.000Z"),
        },
      ],
    },
    {
      id: "4f8bb562-9d6f-41eb-91e7-d1a8ee6ad2e0",
      title: "Lumen Beauty Atelier",
      description:
        "Hair, color, and brow appointments in a quiet studio near Cascade.",
      translations: {
        "ru-RU": {
          title: "Lumen Beauty Atelier",
          description:
            "Стрижки, окрашивание и оформление бровей в камерной студии рядом с Каскадом.",
        },
      },
      publicSettings: {
        presentationAppearance: "light",
        contactLabel: "Lumen Beauty Atelier",
        contactEmail: null,
        contactPhone: null,
        primaryCtaLabel: "Book · Записаться",
        secondaryCtaLabel: "Call · Позвонить",
        inquiryText:
          "Share the service, preferred date, and hair length when relevant. / Укажите услугу, дату и длину волос.",
        businessLocation: "Yerevan · Cascade",
        businessHours: "Tue–Sun · 10:00–20:00",
        businessResponseTime: null,
        businessNote:
          "Unitforge demo data — do not send personal information. / Демонстрационные данные — не отправляйте личную информацию.",
        inquiryEnabled: false,
      },
      slug: "demo-lumen-beauty-yerevan",
      currency: "AMD",
      locale: "en-US",
      theme: "stone",
      status: "published",
      publishedAt: new Date("2026-07-03T10:00:00.000Z"),
      createdAt: new Date("2026-07-01T09:00:00.000Z"),
      updatedAt: new Date("2026-07-14T16:10:00.000Z"),
      items: [
        {
          id: "737b2454-3583-44aa-a902-2f7fe9874caa",
          name: "Signature haircut",
          description:
            "Consultation, wash, cut, and finish for short or medium hair.",
          section: "Cut & style",
          translations: {
            "ru-RU": {
              name: "Авторская стрижка",
              description:
                "Консультация, мытье, стрижка и укладка для коротких или средних волос.",
              section: "Стрижки и укладки",
            },
          },
          priceCents: 1_400_000,
          position: 0,
        },
        {
          id: "0864d508-10d9-4c29-8096-526fa8023987",
          name: "Color consultation",
          description:
            "Tone selection, strand assessment, and a personal color plan.",
          section: "Color",
          translations: {
            "ru-RU": {
              name: "Консультация колориста",
              description:
                "Подбор оттенка, оценка пряди и персональный план окрашивания.",
              section: "Окрашивание",
            },
          },
          priceCents: 800_000,
          position: 1,
        },
        {
          id: "6ce9d60e-49ca-4b88-9511-3a4b8e53b5db",
          name: "Single-tone color",
          description:
            "Root-to-length color for medium hair; product included.",
          section: "Color",
          translations: {
            "ru-RU": {
              name: "Окрашивание в один тон",
              description:
                "Окрашивание от корней по длине для средних волос; материалы включены.",
              section: "Окрашивание",
            },
          },
          priceCents: 3_200_000,
          position: 2,
        },
        {
          id: "a93c58c4-9dba-486d-a233-40b129dc3ca1",
          name: "Balayage",
          description:
            "Dimensional lightening, toner, treatment, and finish for medium hair.",
          section: "Color",
          translations: {
            "ru-RU": {
              name: "Балаяж",
              description:
                "Осветление, тонирование, уход и укладка для средних волос.",
              section: "Окрашивание",
            },
          },
          priceCents: 5_500_000,
          position: 3,
        },
        {
          id: "ee516f8b-05cc-46e8-9b3c-034aaabdd945",
          name: "Event styling",
          description:
            "Polished updo or waves for an event; accessories not included.",
          section: "Cut & style",
          translations: {
            "ru-RU": {
              name: "Вечерняя укладка",
              description:
                "Собранная прическа или волны; аксессуары оплачиваются отдельно.",
              section: "Стрижки и укладки",
            },
          },
          priceCents: 2_200_000,
          position: 4,
        },
        {
          id: "51be357a-d9aa-499e-b226-c1ff9038d355",
          name: "Brow shape & tint",
          description: "Shape correction, tint, and finishing care.",
          section: "Brows",
          translations: {
            "ru-RU": {
              name: "Коррекция и окрашивание бровей",
              description: "Коррекция формы, окрашивание и завершающий уход.",
              section: "Брови",
            },
          },
          priceCents: 1_000_000,
          position: 5,
        },
        {
          id: "5c8a147b-abf6-479f-b147-3da8fe4908d6",
          name: "Hair treatment ritual",
          description:
            "Deep-conditioning treatment selected for the current hair condition.",
          section: "Care",
          translations: {
            "ru-RU": {
              name: "Ритуал ухода за волосами",
              description:
                "Интенсивный уход, подобранный под текущее состояние волос.",
              section: "Уход",
            },
          },
          priceCents: 1_600_000,
          position: 6,
        },
      ],
      leads: [
        {
          id: "caaa0d4b-cc44-4d09-b4ed-c723dc9ae5d7",
          contactName: "Mariam H.",
          companyOrBusinessName: null,
          email: "mariam.h@inquiries.example",
          phoneOrHandle: "@mariam_showcase",
          message:
            "I need event styling on July 25 around noon. My hair is shoulder length.",
          locale: "en-US",
          createdAt: new Date("2026-07-14T11:05:00.000Z"),
        },
        {
          id: "353a50cc-7c49-43e6-b44a-a35ebb3d6d50",
          contactName: "Анаит К.",
          companyOrBusinessName: null,
          email: "anahit.k@inquiries.example",
          phoneOrHandle: "+374 00 000 203",
          message:
            "Подскажите свободное время на консультацию колориста в четверг вечером.",
          locale: "ru-RU",
          createdAt: new Date("2026-07-12T15:36:00.000Z"),
        },
      ],
    },
    {
      id: "0a7b4fc9-a5f1-466c-a18c-85e1eb6fa431",
      title: "Northline Auto Care",
      description:
        "Плановое обслуживание и детейлинг в Ереване. Согласуем работы и бюджет до начала.",
      translations: {
        "en-US": {
          title: "Northline Auto Care",
          description:
            "Maintenance and detailing in Yerevan. Work and budget are approved before we begin.",
        },
      },
      publicSettings: {
        presentationAppearance: "dark",
        contactLabel: "Northline Auto Care",
        contactEmail: null,
        contactPhone: null,
        primaryCtaLabel: "Заявка · Request",
        secondaryCtaLabel: "Позвонить · Call",
        inquiryText:
          "Укажите марку, модель, год и нужную услугу. / Send the make, model, year, and requested service.",
        businessLocation: "Yerevan · Arabkir",
        businessHours: "Mon–Sat · 09:00–19:00",
        businessResponseTime: null,
        businessNote:
          "Демонстрационные данные Unitforge — не отправляйте личную информацию. / Unitforge demo data — do not send personal information.",
        inquiryEnabled: false,
      },
      slug: "demo-northline-auto-care-yerevan",
      currency: "AMD",
      locale: "ru-RU",
      theme: "slate",
      status: "published",
      publishedAt: new Date("2026-07-04T07:45:00.000Z"),
      createdAt: new Date("2026-07-01T10:00:00.000Z"),
      updatedAt: new Date("2026-07-13T12:40:00.000Z"),
      items: [
        {
          id: "0f3cf923-9aad-47cd-95f8-f0f713b9ac90",
          name: "Компьютерная диагностика",
          description: "Сканирование систем, проверка ошибок и краткий отчет.",
          section: "Диагностика",
          translations: {
            "en-US": {
              name: "Computer diagnostics",
              description: "System scan, fault review, and a concise report.",
              section: "Diagnostics",
            },
          },
          priceCents: 1_500_000,
          position: 0,
        },
        {
          id: "5d40d27e-d2ec-47c5-bbe1-2c6abacf4eb0",
          name: "Замена масла",
          description:
            "Работа, проверка уровней жидкостей и сброс сервисного интервала.",
          section: "Обслуживание",
          translations: {
            "en-US": {
              name: "Oil change service",
              description:
                "Labor, fluid-level check, and service-interval reset.",
              section: "Maintenance",
            },
          },
          priceCents: 1_200_000,
          position: 1,
        },
        {
          id: "d661c5e3-06ca-46ea-9964-d6fd008763bd",
          name: "Проверка тормозной системы",
          description: "Осмотр колодок, дисков и тормозной жидкости.",
          section: "Обслуживание",
          translations: {
            "en-US": {
              name: "Brake system inspection",
              description: "Inspection of pads, discs, and brake fluid.",
              section: "Maintenance",
            },
          },
          priceCents: 1_800_000,
          position: 2,
        },
        {
          id: "d047f64d-a258-4c57-acdc-144d26bac742",
          name: "Детейлинг салона",
          description: "Глубокая очистка сидений, пола, пластика и багажника.",
          section: "Детейлинг",
          translations: {
            "en-US": {
              name: "Interior detailing",
              description:
                "Deep cleaning of seats, floors, trim, and luggage area.",
              section: "Detailing",
            },
          },
          priceCents: 4_500_000,
          position: 3,
        },
        {
          id: "3be1a656-4fc1-424d-af5b-13325d1f7070",
          name: "Детейлинг кузова",
          description: "Ручная мойка, очистка загрязнений и защитный воск.",
          section: "Детейлинг",
          translations: {
            "en-US": {
              name: "Exterior detailing",
              description: "Hand wash, decontamination, and protective wax.",
              section: "Detailing",
            },
          },
          priceCents: 3_500_000,
          position: 4,
        },
        {
          id: "066efe8f-4d64-4cca-849a-bbaf3e0e170b",
          name: "Керамическое покрытие",
          description:
            "Подготовка кузова и нанесение защитного покрытия в один слой.",
          section: "Защита кузова",
          translations: {
            "en-US": {
              name: "Ceramic coating",
              description:
                "Paint preparation and one-layer protective coating.",
              section: "Paint protection",
            },
          },
          priceCents: 12_000_000,
          position: 5,
        },
        {
          id: "11788018-3a66-4bc7-873c-d18c477a1a02",
          name: "Сезонная проверка",
          description:
            "Шины, аккумулятор, жидкости, свет и базовая диагностика.",
          section: "Диагностика",
          translations: {
            "en-US": {
              name: "Seasonal inspection",
              description:
                "Tires, battery, fluids, lights, and a basic diagnostic check.",
              section: "Diagnostics",
            },
          },
          priceCents: 2_000_000,
          position: 6,
        },
      ],
      leads: [
        {
          id: "e2eac286-3264-4a6c-836e-22d7b0c03cd9",
          contactName: "Давид А.",
          companyOrBusinessName: "Ararat Routes",
          email: "davit.a@inquiries.example",
          phoneOrHandle: "+374 00 000 204",
          message:
            "Нужен детейлинг салона для Toyota Camry 2021. Когда есть окно на этой неделе?",
          locale: "ru-RU",
          createdAt: new Date("2026-07-15T06:50:00.000Z"),
        },
        {
          id: "081f55aa-e40f-4336-8345-8eebedeb9f45",
          contactName: "Levon P.",
          companyOrBusinessName: null,
          email: "levon.p@inquiries.example",
          phoneOrHandle: "+374 00 000 205",
          message:
            "BMW X3, 2019. I would like diagnostics and a brake inspection on Friday morning.",
          locale: "en-US",
          createdAt: new Date("2026-07-11T10:22:00.000Z"),
        },
        {
          id: "9cabb0eb-fb94-443e-a8c7-d4ed32254390",
          contactName: "София Г.",
          companyOrBusinessName: null,
          email: "sofia.g@inquiries.example",
          phoneOrHandle: "@sofia_showcase",
          message:
            "Подскажите стоимость керамического покрытия для нового компактного кроссовера.",
          locale: "ru-RU",
          createdAt: new Date("2026-07-09T14:08:00.000Z"),
        },
      ],
    },
  ],
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const disallowedFixtureCopy = /\b(copy|test|placeholder|lorem)\b/i;

export function validateSalesDemoFixture(
  fixture: SalesDemoFixture = salesDemoFixture,
) {
  assert(uuidPattern.test(fixture.user.id), "Demo user id must be a UUID.");
  assert(
    uuidPattern.test(fixture.workspace.id),
    "Demo workspace id must be a UUID.",
  );
  assert(
    uuidPattern.test(fixture.subscription.id),
    "Demo subscription id must be a UUID.",
  );
  assert(
    slugPattern.test(fixture.workspace.slug),
    "Demo workspace slug is invalid.",
  );
  assert(
    fixture.user.email.endsWith(".example"),
    "Demo login email must use the reserved .example domain.",
  );
  assert(
    fixture.priceSheets.length === 3,
    "The sales demo must contain exactly three Price Sheets.",
  );

  const themes = new Set<SalesDemoTheme>();
  const slugs = new Set<string>();
  const ids = new Set([
    fixture.user.id,
    fixture.workspace.id,
    fixture.subscription.id,
  ]);

  for (const priceSheet of fixture.priceSheets) {
    assertUniqueUuid(ids, priceSheet.id, `Price Sheet ${priceSheet.slug}`);
    assert(
      slugPattern.test(priceSheet.slug),
      `Price Sheet slug ${priceSheet.slug} is invalid.`,
    );
    assert(
      !slugs.has(priceSheet.slug),
      `Duplicate Price Sheet slug: ${priceSheet.slug}.`,
    );
    slugs.add(priceSheet.slug);
    themes.add(priceSheet.theme);
    assert(
      priceSheet.status === "published",
      `${priceSheet.slug} must be published.`,
    );
    assert(
      priceSheet.slug.startsWith("demo-"),
      `${priceSheet.slug} must be visibly marked as a demo route.`,
    );
    assert(
      !priceSheet.publicSettings.inquiryEnabled,
      `${priceSheet.slug} must not accept real public inquiries.`,
    );
    assert(priceSheet.currency === "AMD", `${priceSheet.slug} must use AMD.`);
    assert(
      priceSheet.items.length >= 5 && priceSheet.items.length <= 8,
      `${priceSheet.slug} must contain 5–8 services.`,
    );
    assert(
      priceSheet.leads.length >= 2,
      `${priceSheet.slug} must contain at least two inquiries.`,
    );
    assert(
      !priceSheet.publicSettings.contactEmail &&
        !priceSheet.publicSettings.contactPhone,
      `${priceSheet.slug} must not expose fake contact details.`,
    );
    assert(
      !priceSheet.publicSettings.businessResponseTime,
      `${priceSheet.slug} must not promise a fictional response time.`,
    );
    assert(
      priceSheet.publicSettings.businessNote?.toLowerCase().includes("demo"),
      `${priceSheet.slug} must disclose that its data is a demo.`,
    );

    const alternateLocale = priceSheet.locale === "ru-RU" ? "en-US" : "ru-RU";
    assert(
      priceSheet.translations[alternateLocale]?.title,
      `${priceSheet.slug} is missing its ${alternateLocale} translation.`,
    );
    assertNoDisallowedCopy(
      [priceSheet.title, priceSheet.description],
      priceSheet.slug,
    );

    const positions = new Set<number>();

    for (const item of priceSheet.items) {
      assertUniqueUuid(ids, item.id, `Service ${item.name}`);
      assert(
        !positions.has(item.position),
        `${priceSheet.slug} has duplicate service position ${item.position}.`,
      );
      positions.add(item.position);
      assert(item.priceCents > 0, `${item.name} must have a positive price.`);
      assert(
        item.translations[alternateLocale]?.name,
        `${item.name} is missing its ${alternateLocale} translation.`,
      );
      assertNoDisallowedCopy(
        [item.name, item.description, item.section],
        item.id,
      );
    }

    assert(
      [...positions]
        .sort((left, right) => left - right)
        .every((position, index) => position === index),
      `${priceSheet.slug} service positions must be contiguous from zero.`,
    );

    for (const lead of priceSheet.leads) {
      assertUniqueUuid(ids, lead.id, `Inquiry ${lead.contactName}`);
      assert(
        lead.email.endsWith(".example"),
        `${lead.contactName} must use a sanitized inquiry email.`,
      );
      assertNoDisallowedCopy(
        [lead.contactName, lead.companyOrBusinessName ?? "", lead.message],
        lead.id,
      );
    }
  }

  assert(
    themes.size === 3 &&
      themes.has("amber") &&
      themes.has("stone") &&
      themes.has("slate"),
    "The sales demo must cover amber, stone, and slate themes.",
  );

  return {
    workspaceSlug: fixture.workspace.slug,
    priceSheetCount: fixture.priceSheets.length,
    serviceCount: fixture.priceSheets.reduce(
      (total, priceSheet) => total + priceSheet.items.length,
      0,
    ),
    inquiryCount: fixture.priceSheets.reduce(
      (total, priceSheet) => total + priceSheet.leads.length,
      0,
    ),
  };
}

function assertUniqueUuid(ids: Set<string>, id: string, label: string) {
  assert(uuidPattern.test(id), `${label} id must be a UUID.`);
  assert(!ids.has(id), `${label} reuses fixture id ${id}.`);
  ids.add(id);
}

function assertNoDisallowedCopy(values: string[], label: string) {
  assert(
    !values.some((value) => disallowedFixtureCopy.test(value)),
    `${label} contains QA or placeholder copy.`,
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
