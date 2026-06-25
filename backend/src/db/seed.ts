import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";

const MODULES = [
  {
    type: "header",
    name: "Nagłówek",
    description: "Górny pasek nawigacji z logo i menu",
    icon: "menu",
    default_config: {
      variant: "dark",
      logo: "Moja Strona",
      links: [
        { label: "Start", href: "#" },
        { label: "O nas", href: "#about" },
        { label: "Kontakt", href: "#contact" },
      ],
    },
  },
  {
    type: "hero",
    name: "Sekcja Hero",
    description: "Duży baner z tytułem, opisem i przyciskiem CTA",
    icon: "target",
    default_config: {
      variant: "primary",
      title: "Witaj na naszej stronie",
      subtitle: "Twórz piękne strony z gotowych modułów",
      buttonText: "Dowiedz się więcej",
      buttonLink: "#",
      align: "center",
    },
  },
  {
    type: "text",
    name: "Blok tekstowy",
    description: "Sekcja z nagłówkiem i akapitem tekstu",
    icon: "file-text",
    default_config: {
      variant: "surface",
      heading: "O nas",
      content:
        "Jesteśmy zespołem pasjonatów tworzących nowoczesne strony internetowe. Nasze moduły pozwalają szybko budować profesjonalne projekty.",
      padding: "large",
    },
  },
  {
    type: "features",
    name: "Lista cech",
    description: "Trzy kolumny z ikonami i opisami",
    icon: "sparkles",
    default_config: {
      variant: "elevated",
      title: "Nasze zalety",
      items: [
        {
          icon: "zap",
          title: "Szybkość",
          description: "Błyskawiczne ładowanie strony",
        },
        {
          icon: "palette",
          title: "Design",
          description: "Nowoczesny i responsywny wygląd",
        },
        {
          icon: "wrench",
          title: "Elastyczność",
          description: "Łatwa konfiguracja modułów",
        },
      ],
    },
  },
  {
    type: "gallery",
    name: "Galeria",
    description: "Siatka zdjęć z podpisami",
    icon: "image",
    default_config: {
      variant: "surface",
      title: "Galeria",
      images: [
        { url: "https://picsum.photos/400/300?random=1", caption: "Zdjęcie 1" },
        { url: "https://picsum.photos/400/300?random=2", caption: "Zdjęcie 2" },
        { url: "https://picsum.photos/400/300?random=3", caption: "Zdjęcie 3" },
      ],
    },
  },
  {
    type: "contact",
    name: "Formularz kontaktowy",
    description: "Sekcja z danymi kontaktowymi i formularzem",
    icon: "mail",
    default_config: {
      variant: "elevated",
      title: "Skontaktuj się",
      email: "kontakt@example.com",
      phone: "+48 123 456 789",
      address: "ul. Przykładowa 1, Warszawa",
    },
  },
  {
    type: "footer",
    name: "Stopka",
    description: "Dolna sekcja z copyright i linkami",
    icon: "arrow-down-to-line",
    default_config: {
      variant: "dark",
      copyright: "© 2026 Moja Strona. Wszelkie prawa zastrzeżone.",
      links: [
        { label: "Polityka prywatności", href: "#" },
        { label: "Regulamin", href: "#" },
      ],
    },
  },
  {
    type: "cta",
    name: "Wezwanie do działania",
    description: "Sekcja CTA z przyciskiem",
    icon: "megaphone",
    default_config: {
      variant: "primary",
      title: "Gotowy, aby zacząć?",
      subtitle: "Dołącz do tysięcy zadowolonych użytkowników już dziś.",
      buttonText: "Rozpocznij teraz",
      buttonLink: "#",
    },
  },
  {
    type: "faq",
    name: "FAQ",
    description: "Najczęściej zadawane pytania",
    icon: "help-circle",
    default_config: {
      variant: "surface",
      title: "Często zadawane pytania",
      items: [
        {
          question: "Jak zacząć?",
          answer:
            "Utwórz projekt, dodaj moduły i dostosuj je do swoich potrzeb.",
        },
        {
          question: "Czy mogę eksportować stronę?",
          answer: "Tak — eksportuj projekt do JSON lub gotowego HTML.",
        },
        {
          question: "Czy edytor jest darmowy?",
          answer: "Tak, możesz tworzyć nieograniczoną liczbę projektów.",
        },
      ],
    },
  },
  {
    type: "testimonials",
    name: "Opinie klientów",
    description: "Referencje i cytaty",
    icon: "message-square",
    default_config: {
      variant: "elevated",
      title: "Co mówią nasi klienci",
      items: [
        {
          name: "Anna Kowalska",
          role: "CEO, StartupX",
          quote: "Edytor modułowy zaoszczędził nam tygodnie pracy. Polecam!",
          avatar: "AK",
        },
        {
          name: "Jan Nowak",
          role: "Freelancer",
          quote: "Prosty w obsłudze, a efekt wygląda profesjonalnie.",
          avatar: "JN",
        },
      ],
    },
  },
  {
    type: "pricing",
    name: "Cennik",
    description: "Plany cenowe z listą funkcji",
    icon: "credit-card",
    default_config: {
      variant: "surface",
      title: "Wybierz plan",
      plans: [
        {
          name: "Starter",
          price: "0",
          period: "mies.",
          features: ["1 projekt", "Podstawowe moduły", "Eksport JSON"],
          highlighted: false,
        },
        {
          name: "Pro",
          price: "49",
          period: "mies.",
          features: [
            "Nielimitowane projekty",
            "Wszystkie moduły",
            "Eksport HTML",
          ],
          highlighted: true,
        },
        {
          name: "Enterprise",
          price: "199",
          period: "mies.",
          features: ["Wsparcie priorytetowe", "Własne moduły", "SLA"],
          highlighted: false,
        },
      ],
    },
  },
  {
    type: "stats",
    name: "Statystyki",
    description: "Liczby i wskaźniki w kolumnach",
    icon: "bar-chart-3",
    default_config: {
      variant: "primary",
      title: "W liczbach",
      items: [
        { value: "10k+", label: "Użytkowników" },
        { value: "500+", label: "Projektów" },
        { value: "99%", label: "Zadowolenia" },
        { value: "24/7", label: "Wsparcie" },
      ],
    },
  },
];

export function seedModules(db: Database.Database): void {
  const exists = db.prepare("SELECT type FROM modules WHERE type = ?");
  const insert = db.prepare(`
    INSERT INTO modules (id, name, type, description, icon, default_config)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const updateDefaults = db.prepare(`
    UPDATE modules SET default_config = ?, icon = ? WHERE type = ?
  `);

  const sync = db.transaction(() => {
    for (const mod of MODULES) {
      const serialized = JSON.stringify(mod.default_config);
      if (exists.get(mod.type)) {
        updateDefaults.run(serialized, mod.icon, mod.type);
      } else {
        insert.run(
          uuidv4(),
          mod.name,
          mod.type,
          mod.description,
          mod.icon,
          serialized,
        );
      }
    }
  });

  sync();
}

export { MODULES };
