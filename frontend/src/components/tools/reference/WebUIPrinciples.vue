<template>
  <div class="webui-principles-tool">
    <ToolHeader
      title="Principes WebUI"
      description="Tableau de bord interactif des principes fondamentaux du design web."
      icon="webui-principles"
      category="reference"
      status="Migré vers Vue"
      :show-badges="true"
    />

    <!-- Mobile menu overlay -->
    <div
      id="menu-overlay"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-all duration-300"
      :class="{
        'opacity-100 visible': isMobileMenuOpen,
        'opacity-0 invisible': !isMobileMenuOpen,
      }"
    ></div>

    <div class="flex min-h-screen max-w-full overflow-x-hidden">
      <aside
        id="sidebar"
        class="w-full sm:w-64 bg-white shadow-lg fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0"
        :class="{
          '-translate-x-full': !isMobileMenuOpen,
          'translate-x-0': isMobileMenuOpen,
        }"
      >
        <div class="p-4 sm:p-6 border-b border-gray-200 mt-12 md:mt-0">
          <h1 class="text-lg sm:text-xl font-bold text-[#A59469]">
            Les Règles d'Or
          </h1>
          <p class="text-xs sm:text-sm text-gray-500">de l'UI Design</p>
        </div>
        <nav id="main-nav" class="mt-4 flex flex-col">
          <a
            v-for="section in navSections"
            :key="section.id"
            :href="`#${section.id}`"
            class="nav-link py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base text-gray-600 font-semibold"
            :class="{ active: activeSection === section.id }"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </a>
        </nav>
      </aside>

      <!-- Mobile header -->
      <header
        class="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-3 sm:p-4 z-40 flex justify-between items-center"
      >
        <h1 class="text-base sm:text-lg font-bold text-[#A59469]">
          Les Règles d'Or
        </h1>
        <button
          id="menu-toggle"
          class="text-gray-700"
          @click="toggleMobileMenu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </header>

      <!-- Main content -->
      <main
        class="flex-1 md:ml-64 p-3 sm:p-4 md:p-6 lg:p-8 pt-16 md:pt-8 max-w-none overflow-x-hidden pb-8"
      >
        <section id="structure" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            1. Structure et Disposition
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            Ces règles garantissent un design ordonné qui guide naturellement
            l'œil de l'utilisateur. Elles sont le fondement de toute interface
            claire et professionnelle.
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div class="card">
              <h3
                class="font-bold text-base sm:text-lg mb-3 flex flex-wrap items-center"
              >
                Règle n°1 : Tout doit être aligné.
                <i
                  class="info-btn ml-1 sm:ml-2"
                  data-rule="alignement"
                  @click="openModal('alignement')"
                  >i</i
                >
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Chaque élément doit être intentionnellement aligné avec un
                autre. L'alignement crée un ordre visuel instantané.
              </p>
              <div
                class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg"
              >
                <div
                  class="w-full h-10 bg-red-100 mb-4 border-l-2 border-red-500 pl-2 flex items-center"
                >
                  Aligné à gauche
                </div>
                <div
                  class="w-3/4 h-10 bg-red-100 mb-4 border-l-2 border-red-500 pl-2 flex items-center"
                >
                  Avec le titre
                </div>
                <div
                  class="w-1/2 h-10 bg-red-100 border-l-2 border-red-500 pl-2 flex items-center"
                >
                  Et le paragraphe
                </div>
              </div>
            </div>
            <div class="card">
              <h3
                class="font-bold text-base sm:text-lg mb-3 flex flex-wrap items-center"
              >
                Règle n°2 : Utilisez une grille de 8 points.
                <i
                  class="info-btn ml-1 sm:ml-2"
                  data-rule="grille8pt"
                  @click="openModal('grille8pt')"
                  >i</i
                >
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Utilisez des multiples de 8 (8, 16, 24, 32px...) pour tous les
                espacements, marges et dimensions. Cela assure une cohérence
                rythmique.
              </p>
              <div
                class="flex items-center justify-center space-x-2 sm:space-x-4"
              >
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#A59469] rounded-lg flex-shrink-0"
                ></div>
                <div class="text-center">
                  <p class="font-mono text-sm text-[#A59469]">24px</p>
                  <div class="w-6 h-px bg-gray-300"></div>
                </div>
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#A59469] rounded-lg flex-shrink-0"
                ></div>
              </div>
            </div>
            <div class="lg:col-span-2 card">
              <h3
                class="font-bold text-base sm:text-lg mb-3 flex flex-wrap items-center"
              >
                Règle n°3 : L'espacement crée des relations.
                <i
                  class="info-btn ml-1 sm:ml-2"
                  data-rule="espacement"
                  @click="openModal('espacement')"
                  >i</i
                >
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Les éléments proches sont perçus comme un groupe. L'espace blanc
                est votre outil le plus puissant pour structurer l'information.
              </p>
              <div
                class="flex flex-col sm:flex-row justify-around p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <div>
                  <label class="font-semibold text-sm">Nom d'utilisateur</label>
                  <div
                    class="w-full sm:max-w-48 h-8 sm:h-10 bg-white border rounded-md mt-1"
                  ></div>
                </div>
                <div class="">
                  <label class="font-semibold text-sm">Mot de passe</label>
                  <div
                    class="w-full sm:max-w-48 h-8 sm:h-10 bg-white border rounded-md mt-1"
                  ></div>
                </div>
              </div>
              <p class="text-center text-xs mt-2 text-gray-500">
                L'espace entre le label et l'input (8px) est plus petit que
                l'espace entre les groupes (32px).
              </p>
            </div>
          </div>
          <div class="card mt-4 sm:mt-6 lg:mt-8">
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              Pour aller plus loin
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
            >
              <a
                href="https://spec.fm/specifics/8-pt-grid"
                target="_blank"
                class="resource-card"
              >
                <p class="text-xl sm:text-2xl mb-1 sm:mb-2">🛠️</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Outil : 8pt Grid
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Un guide pour implémenter la grille de 8 points.
                </p>
              </a>
              <a
                href="https://lawsofux.com/fr/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">📖</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Article : Lois de l'UX
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Explorez les principes psychologiques du design.
                </p>
              </a>
              <a
                href="https://www.awwwards.com/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">🎨</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Inspiration : Awwwards
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Découvrez les meilleures mises en page du web.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section id="typographie" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            2. Typographie et Lisibilité
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            Une typographie maîtrisée rend votre interface lisible, hiérarchisée
            et professionnelle.
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div class="card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Règle n°4 : Limitez les polices.
                <i
                  class="info-btn"
                  data-rule="polices"
                  @click="openModal('polices')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Utilisez une seule police polyvalente (le plus sûr) ou deux
                polices contrastées pour éviter le chaos visuel.
              </p>
              <h3 class="font-bold text-lg mb-3 mt-6 flex items-center">
                Règle n°5 : Établissez une échelle typographique.
                <i
                  class="info-btn"
                  data-rule="echelleTypo"
                  @click="openModal('echelleTypo')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Définissez une échelle de tailles de police cohérente pour créer
                une hiérarchie visuelle instantanée.
              </p>
            </div>
            <div class="card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Règle n°6 : Assurez la lisibilité.
                <i
                  class="info-btn"
                  data-rule="lisibilite"
                  @click="openModal('lisibilite')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Des lignes de texte et un interlignage corrects sont essentiels
                pour le confort de lecture.
              </p>
              <div class="p-4 bg-gray-50 rounded-lg border">
                <p class="text-base leading-relaxed">
                  Cette ligne de texte contient environ 65 caractères, ce qui
                  est idéal. La hauteur de ligne (interligne) est de 150% (ou
                  1.5), ce qui aère le texte et facilite le passage de l'œil
                  d'une ligne à l'autre sans effort.
                </p>
              </div>
            </div>
          </div>
          <div class="card mt-4 sm:mt-6 lg:mt-8">
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              Pour aller plus loin
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
            >
              <a
                href="https://fonts.google.com/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-xl sm:text-2xl mb-1 sm:mb-2">🛠️</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Outil : Google Fonts
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Explorez et testez des centaines de polices web.
                </p>
              </a>
              <a
                href="https://www.smashingmagazine.com/2020/09/web-typography-guide/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">📖</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Article : Guide Typo (EN)
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Un guide complet sur la typographie web.
                </p>
              </a>
              <a
                href="https://www.typewolf.com/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">🎨</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Inspiration : Typewolf
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Des exemples d'excellentes associations de polices.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section id="couleur" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            3. Couleur et Interaction
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            La couleur et le feedback visuel guident l'utilisateur et rendent
            l'interface vivante et utilisable.
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div class="card">
              <h3
                class="font-bold text-lg mb-3 text-center flex items-center justify-center"
              >
                Règle n°8 : Assurez un contraste suffisant.
                <i
                  class="info-btn"
                  data-rule="contraste"
                  @click="openModal('contraste')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4 text-center">
                La règle WCAG AA exige un ratio de contraste d'au moins 4.5:1
                pour le texte.
              </p>
              <div class="flex justify-around text-center">
                <div class="p-4 rounded-lg bg-[#A59469] text-white">
                  <p class="font-bold">Bon Contraste</p>
                  <p class="text-sm">(4.6:1)</p>
                </div>
                <div class="p-4 rounded-lg bg-[#D9CDB8] text-white">
                  <p class="font-bold">Mauvais Contraste</p>
                  <p class="text-sm">(1.6:1)</p>
                </div>
              </div>
            </div>
            <div class="card">
              <h3
                class="font-bold text-lg mb-3 text-center flex items-center justify-center"
              >
                La Règle du 60-30-10
                <i
                  class="info-btn"
                  data-rule="60-30-10"
                  @click="openModal('60-30-10')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4 text-center">
                Une technique simple pour une palette équilibrée.
              </p>
              <div class="chart-container">
                <canvas id="colorChart"></canvas>
              </div>
            </div>
            <div class="lg:col-span-2 card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Règle n°7 : Chaque élément interactif DOIT avoir plusieurs
                états.
                <i
                  class="info-btn"
                  data-rule="etats"
                  @click="openModal('etats')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Un utilisateur doit savoir qu'un élément est cliquable et
                recevoir un retour d'information. Interagissez avec les boutons
                ci-dessous.
              </p>
              <div
                class="flex flex-wrap justify-center items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <button class="demo-button primary">Défaut</button>
                <button class="demo-button primary" disabled>Désactivé</button>
                <button class="demo-button secondary">Secondaire</button>
              </div>
            </div>
            <div class="lg:col-span-2 card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Règle n°9 : Une seule action principale par écran.
                <i class="info-btn" data-rule="cta" @click="openModal('cta')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Chaque écran doit avoir un objectif clair, matérialisé par un
                seul bouton d'action principal (CTA). Les autres actions doivent
                être visuellement secondaires.
              </p>
            </div>
          </div>
          <div class="card mt-4 sm:mt-6 lg:mt-8">
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              Pour aller plus loin
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
            >
              <a
                href="https://coolors.co/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-xl sm:text-2xl mb-1 sm:mb-2">🛠️</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Outil : Coolors
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Générez des palettes de couleurs harmonieuses.
                </p>
              </a>
              <a
                href="https://webaim.org/resources/contrastchecker/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">📖</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Outil : Contrast Checker
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Vérifiez l'accessibilité de vos couleurs.
                </p>
              </a>
              <a
                href="https://dribbble.com/colors/brown"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">🎨</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Inspiration : Dribbble
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Explorez des interfaces par couleur.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section id="pratiques" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            4. Pratiques Modernes
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            Au-delà des bases, ces principes sont essentiels pour créer des
            expériences robustes et inclusives.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div class="card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Responsive Design
                <i
                  class="info-btn"
                  data-rule="responsive"
                  @click="openModal('responsive')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                L'interface doit s'adapter à toutes les tailles d'écran, du
                mobile au bureau.
              </p>
              <div
                class="bg-gray-100 p-3 sm:p-4 rounded-lg flex justify-around items-end h-32 sm:h-40"
              >
                <div
                  class="w-6 h-16 sm:w-8 sm:h-20 md:h-24 bg-[#A59469] rounded-t-lg shadow-inner"
                ></div>
                <div
                  class="w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 bg-[#A59469] rounded-t-lg shadow-inner"
                ></div>
                <div
                  class="w-16 h-20 sm:w-20 sm:h-24 md:w-32 md:h-32 bg-[#A59469] rounded-t-lg shadow-inner"
                ></div>
              </div>
              <p class="text-center text-xs mt-2 font-semibold text-gray-500">
                Mobile → Tablette → Bureau
              </p>
            </div>
            <div class="card">
              <h3 class="font-bold text-lg mb-3 flex items-center">
                Accessibilité (a11y)
                <i class="info-btn" data-rule="a11y" @click="openModal('a11y')"
                  >i</i
                >
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Concevoir pour que tout le monde puisse utiliser votre site, y
                compris les personnes en situation de handicap.
              </p>
              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="p-3 bg-gray-100 rounded-lg">
                  <strong class="text-[#A59469]">P</strong>erceptible
                </div>
                <div class="p-3 bg-gray-100 rounded-lg">
                  <strong class="text-[#A59469]">O</strong>pérable
                </div>
                <div class="p-3 bg-gray-100 rounded-lg">
                  <strong class="text-[#A59469]">U</strong>tilisable
                </div>
                <div class="p-3 bg-gray-100 rounded-lg">
                  <strong class="text-[#A59469]">R</strong>obuste
                </div>
              </div>
            </div>
          </div>
          <div class="card mt-4 sm:mt-6 lg:mt-8">
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              Pour aller plus loin
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
            >
              <a
                href="https://www.a11yproject.com/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-xl sm:text-2xl mb-1 sm:mb-2">🛠️</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Outil : The A11Y Project
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Une mine d'or de ressources sur l'accessibilité.
                </p>
              </a>
              <a
                href="https://developer.mozilla.org/fr/docs/Web/Accessibility"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">📖</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Article : MDN Accessibilité
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  La documentation de référence pour les développeurs.
                </p>
              </a>
              <a
                href="https://www.smashingmagazine.com/category/accessibility/"
                target="_blank"
                class="resource-card"
              >
                <p class="text-2xl mb-2">🎨</p>
                <h4 class="font-semibold text-sm sm:text-base">
                  Inspiration : Smashing Mag
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  Articles et études de cas sur l'accessibilité.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section id="case-study" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            5. Étude de Cas : Bon vs Mauvais Design
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            Rien ne vaut un exemple concret. Comparez ces deux cartes produit et
            utilisez les boutons ci-dessous pour analyser les différences et
            comprendre l'impact des règles d'or.
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <h3
                class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center"
              >
                ✅ Le Bon Exemple
              </h3>
              <div
                id="good-card"
                class="case-study-card max-w-xs sm:max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div class="h-32 sm:h-48 bg-gray-200"></div>
                <div class="p-4 sm:p-6">
                  <div data-analysis-id="espacement" class="mb-4">
                    <h4
                      data-analysis-id="alignement"
                      class="text-lg sm:text-xl font-bold text-gray-800"
                    >
                      Chaussure de Sport Pro
                    </h4>
                    <p
                      data-analysis-id="alignement"
                      class="text-sm sm:text-base text-gray-600 mt-2"
                    >
                      Confort et performance pour tous les terrains.
                    </p>
                  </div>
                  <div
                    data-analysis-id="alignement espacement"
                    class="flex justify-between items-center"
                  >
                    <p class="text-xl sm:text-2xl font-black text-gray-900">
                      99€
                    </p>
                    <button
                      data-analysis-id="cta contraste"
                      class="bg-[#A59469] text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-[#8C7A4B] transition"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3
                class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center"
              >
                ❌ Le Mauvais Exemple
              </h3>
              <div
                id="bad-card"
                class="case-study-card max-w-xs sm:max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div class="h-32 sm:h-48 bg-gray-200"></div>
                <div class="p-3 sm:p-4">
                  <div
                    data-analysis-id="espacement"
                    style="margin-bottom: 21px"
                  >
                    <h4
                      data-analysis-id="alignement"
                      class="text-base sm:text-lg font-bold text-gray-800 text-center"
                    >
                      Chaussure de Sport Pro
                    </h4>
                    <p
                      data-analysis-id="alignement"
                      class="text-sm sm:text-base text-gray-600 mt-1"
                    >
                      Confort et performance pour tous les terrains.
                    </p>
                  </div>
                  <p
                    data-analysis-id="alignement"
                    class="text-xl sm:text-2xl font-black text-gray-900"
                  >
                    99€
                  </p>
                  <div
                    data-analysis-id="alignement espacement cta contraste"
                    class="flex justify-around items-center mt-5"
                  >
                    <button
                      class="bg-blue-500 text-white font-bold py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg text-xs sm:text-sm"
                    >
                      Acheter
                    </button>
                    <a
                      href="#"
                      class="text-gray-500 underline text-xs sm:text-sm"
                      >Plus d'infos</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mt-4 sm:mt-6 lg:mt-8">
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">
              Analyse Interactive
            </h3>
            <div
              id="analysis-controls"
              class="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4"
            >
              <button
                data-analysis-id="alignement"
                class="demo-button secondary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                @click="analyzeCaseStudy('alignement')"
              >
                Alignement
              </button>
              <button
                data-analysis-id="espacement"
                class="demo-button secondary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                @click="analyzeCaseStudy('espacement')"
              >
                Espacement
              </button>
              <button
                data-analysis-id="contraste"
                class="demo-button secondary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                @click="analyzeCaseStudy('contraste')"
              >
                Contraste
              </button>
              <button
                data-analysis-id="cta"
                class="demo-button secondary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                @click="analyzeCaseStudy('cta')"
              >
                CTA
              </button>
            </div>
            <div
              id="analysis-text"
              class="p-3 sm:p-4 bg-gray-50 rounded-lg min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            >
              <p class="text-gray-500 text-center">
                Cliquez sur un bouton pour analyser une règle.
              </p>
            </div>
          </div>
        </section>

        <section id="checklist" class="mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            6. Checklist de Projet
          </h2>
          <p class="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base text-gray-600">
            Utilisez cet outil pour suivre l'application des règles d'or sur
            chaque page de votre projet. Les données sont sauvegardées
            localement dans votre navigateur.
          </p>
          <div class="card mb-4 sm:mb-6 lg:mb-8">
            <form
              id="add-page-form"
              class="flex flex-col sm:flex-row gap-3 sm:gap-4"
              @submit.prevent="addPage"
            >
              <input
                type="text"
                id="page-name-input"
                v-model="newPageName"
                placeholder="Nom de la nouvelle page (ex: Accueil)"
                class="flex-grow p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A59469] focus:border-transparent transition"
              />
              <button
                type="submit"
                class="demo-button primary text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                Ajouter une page
              </button>
            </form>
          </div>
          <!-- Mobile-first checklist container -->
          <div id="checklist-container" class="space-y-4">
            <div v-if="pagesData.length === 0" class="card text-center py-8">
              <p class="text-gray-500 mb-4">
                Aucune page ajoutée. Commencez par en ajouter une !
              </p>
              <div class="text-4xl mb-4">📋</div>
              <p class="text-sm text-gray-400">
                Utilisez le formulaire ci-dessus pour ajouter votre première
                page.
              </p>
            </div>
            <div
              v-for="(page, pageIndex) in pagesData"
              :key="page.name"
              class="card"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between mb-4"
              >
                <div class="mb-2 sm:mb-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800">
                    {{ page.name }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ calculateCompletedRules(page) }}/{{
                      checklistRules.length
                    }}
                    règles validées ({{ calculateProgress(page) }}%)
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: calculateProgress(page) + '%' }"
                    ></div>
                  </div>
                  <button
                    :data-page-index="pageIndex"
                    class="delete-page-btn text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                    @click="deletePage(pageIndex)"
                  >
                    🗑️ Suppr.
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="rule in checklistRules"
                  :key="rule.id"
                  class="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                >
                  <span
                    class="text-xs sm:text-sm font-medium text-gray-700 truncate pr-2"
                    >{{ rule.name }}</span
                  >
                  <button
                    class="three-state-toggle px-2 py-1 text-xs rounded-full font-medium transition"
                    :class="getStateClasses(page.checks[rule.id])"
                    @click="toggleRuleState(pageIndex, rule.id)"
                  >
                    {{ getStateLabel(page.checks[rule.id]) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Modal -->
    <div
      id="info-modal"
      class="modal-overlay"
      :class="{ visible: isModalOpen }"
      @click.self="closeModal"
    >
      <div class="modal-content" :class="{ 'translate-y-0': isModalOpen }">
        <span class="modal-close" @click="closeModal">&times;</span>
        <h3 id="modal-title" class="text-xl font-bold mb-4">
          {{ modalTitle }}
        </h3>
        <p id="modal-text" class="text-gray-600" v-html="modalText"></p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white mt-16 border-t">
      <div
        class="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-500"
      >
        <p>
          &copy; 2025 - Application de diagnostic CSS interactive. Conçue pour
          clarifier les concepts de la cascade CSS.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import Chart from "chart.js/auto";

// Reactive state for mobile menu
const isMobileMenuOpen = ref(false);

// Reactive state for modal
const isModalOpen = ref(false);
const modalTitle = ref("");
const modalText = ref("");

// Reactive state for checklist
const newPageName = ref("");
const pagesData = ref(JSON.parse(localStorage.getItem("checklistData")) || []);

const checklistRules = [
  { id: "alignement", name: "Alignement" },
  { id: "grille8pt", name: "Grille 8pt" },
  { id: "espacement", name: "Espacement" },
  { id: "polices", name: "Polices" },
  { id: "echelleTypo", name: "Échelle Typo" },
  { id: "lisibilite", name: "Lisibilité" },
  { id: "etats", name: "États" },
  { id: "contraste", name: "Contraste" },
  { id: "cta", name: "CTA" },
  { id: "responsive", name: "Responsive" },
  { id: "a11y", name: "Accessibilité" },
];

// Rule explanations for modal
const ruleExplanations = {
  alignement: {
    title: "Le 'Pourquoi' de l'Alignement",
    text: "Notre cerveau cherche instinctivement des motifs. L'alignement crée des lignes invisibles qui connectent les éléments. C'est une application de la <strong>Loi de la Continuité de la Gestalt</strong> : nous percevons les éléments sur une ligne ou une courbe comme étant liés. Un bon alignement réduit l'effort cognitif car l'utilisateur n'a pas à deviner quelles informations vont ensemble.",
  },
  grille8pt: {
    title: "Le 'Pourquoi' de la Grille 8pt",
    text: "Une grille cohérente crée un <strong>rythme visuel</strong>. Tout comme en musique, ce rythme rend la composition harmonieuse et prévisible. Le cerveau de l'utilisateur apprend inconsciemment la logique de l'espacement, ce qui rend l'interface plus facile à scanner et à comprendre. Cela réduit la charge cognitive en éliminant le 'bruit' visuel des espacements incohérents.",
  },
  espacement: {
    title: "Le 'Pourquoi' de l'Espacement",
    text: "C'est la <strong>Loi de la Proximité de la Gestalt</strong> en action. Les éléments physiquement proches les uns des autres sont perçus comme faisant partie d'un même groupe. L'espace blanc n'est pas du vide ; c'est un outil actif pour créer des groupes sémantiques sans avoir besoin de boîtes ou de bordures. Un espacement maîtrisé est la clé d'une interface claire.",
  },
  polices: {
    title: "Le 'Pourquoi' de la Limitation des Polices",
    text: "Trop de polices créent un <strong>chaos visuel</strong> et augmentent la charge cognitive. Chaque nouvelle police est un nouvel élément que le cerveau doit traiter. En limitant le choix à une ou deux, on crée une cohérence qui rend l'interface plus prévisible et professionnelle. Cela renforce également l'identité de la marque.",
  },
  echelleTypo: {
    title: "Le 'Pourquoi' de l'Échelle Typographique",
    text: "Une échelle typographique crée une <strong>hiérarchie visuelle</strong> claire. Elle indique instantanément à l'utilisateur l'ordre d'importance des informations sans qu'il ait à lire le contenu. Le cerveau traite la taille et la graisse bien avant de traiter le sens des mots. C'est un raccourci cognitif qui rend le contenu plus facile à analyser rapidement.",
  },
  lisibilite: {
    title: "Le 'Pourquoi' de la Lisibilité",
    text: "Des lignes trop longues fatiguent les yeux (un phénomène appelé 'saccade'). Un interlignage correct (hauteur de ligne) permet à l'œil de trouver facilement la ligne suivante. Ces règles ne sont pas esthétiques, elles sont <strong>ergonomiques</strong>. Elles visent à minimiser la fatigue physique et cognitive de la lecture sur écran.",
  },
  etats: {
    title: "Le 'Pourquoi' des États Interactifs",
    text: "C'est un principe fondamental de l'interaction homme-machine : le <strong>feedback (retour d'information)</strong>. L'utilisateur a besoin de savoir que le système a reçu sa commande (survol, clic) et quel est l'état actuel de l'élément (désactivé, focus). Sans feedback, l'utilisateur se sent incertain et perd le contrôle, ce qui augmente l'anxiété et la charge cognitive.",
  },
  contraste: {
    title: "Le 'Pourquoi' du Contraste",
    text: "Le contraste affecte directement la <strong>lisibilité perceptive</strong>. Un faible contraste force le cerveau à travailler plus dur pour déchiffrer les lettres, ce qui augmente la fatigue oculaire et la charge cognitive. Si l'accessibilité pour les malvoyants est la raison principale, un bon contraste bénéficie à *tous* les utilisateurs, en particulier sur mobile ou dans des conditions de forte luminosité.",
  },
  "60-30-10": {
    title: "Le 'Pourquoi' de la Règle 60-30-10",
    text: "Cette règle crée un <strong>équilibre visuel</strong> et guide l'attention. La couleur dominante (60%) établit l'ambiance sans surcharger. La couleur secondaire (30%) crée de l'intérêt. La couleur d'accent (10%), utilisée avec parcimonie, attire l'œil vers les actions les plus importantes (CTA). C'est une méthode pour éviter le chaos colorimétrique et créer une hiérarchie claire.",
  },
  cta: {
    title: "Le 'Pourquoi' du CTA Unique",
    text: "Ceci est une application directe de la <strong>Loi de Hick</strong>. Cette loi stipule que le temps nécessaire pour prendre une décision augmente avec le nombre et la complexité des choix. En présentant une seule action principale claire et en rendant les autres actions secondaires, vous réduisez le temps de décision de l'utilisateur au minimum, ce qui augmente considérablement les chances qu'il accomplisse l'action souhaitée.",
  },
  responsive: {
    title: "Le 'Pourquoi' du Responsive Design",
    text: "Le responsive design assure une <strong>expérience utilisateur cohérente</strong> quel que soit l'appareil. Il repose sur 3 piliers : les grilles fluides (%), les images flexibles (max-width) et les media queries (points de rupture). L'approche 'Mobile-First' force à prioriser le contenu essentiel, ce qui bénéficie à toutes les versions du site.",
  },
  a11y: {
    title: "Le 'Pourquoi' de l'Accessibilité (POUR)",
    text: "L'accessibilité vise à rendre le web utilisable par tous, y compris les personnes en situation de handicap. Les principes <strong>POUR</strong> signifient : <strong>P</strong>erceptible (ex: texte alternatif pour les images), <strong>O</strong>pérable (ex: navigation au clavier), <strong>U</strong>tilisable (ex: langage clair) et <strong>R</strong>obuste (ex: code HTML sémantique). Concevoir pour l'accessibilité améliore l'expérience pour *tous* les utilisateurs.",
  },
};

// Case Study analysis content
const analysisContent = {
  alignement: {
    text: "<strong>✅ Bon:</strong> Tous les textes sont alignés à gauche, créant une ligne de lecture claire et facile à suivre. Le prix et le bouton sont alignés sur une même ligne de base.<br><strong>❌ Mauvais:</strong> L'alignement est chaotique. Le titre est centré, le reste est à gauche, créant une tension visuelle. Rien n'est aligné correctement, ce qui force l'œil à sauter partout et rend la lecture difficile.",
  },
  espacement: {
    text: "<strong>✅ Bon:</strong> Les espacements suivent la grille de 8pt (ex: 16px sous le texte, 24px entre les blocs). L'espace entre le prix et le bouton est suffisant. Cela crée des groupes logiques clairs.<br><strong>❌ Mauvais:</strong> Les espacements sont arbitraires (21px, 5px...). Les éléments sont soit trop serrés, soit trop éloignés, ce qui brise les relations logiques et donne une impression de désordre.",
  },
  contraste: {
    text: "<strong>✅ Bon:</strong> Le bouton d'action a un excellent contraste (texte blanc sur fond sombre), le rendant très lisible et visible. Le texte noir sur fond blanc est optimal.<br><strong>❌ Mauvais:</strong> Le lien 'Plus d'infos' a un très faible contraste (gris sur blanc), le rendant difficile à lire. Le bouton bleu a un contraste acceptable mais moins fort.",
  },
  cta: {
    text: "<strong>✅ Bon:</strong> Il y a un seul bouton d'action principal (CTA) clair et proéminent. L'utilisateur sait exactement quoi faire.<br><strong>❌ Mauvais:</strong> Il y a deux actions concurrentes ('Acheter' et 'Plus d'infos') qui se disputent l'attention. L'utilisateur hésite, ce qui augmente la charge cognitive et diminue le taux de conversion (Loi de Hick).",
  },
};

// Case Study Logic
const analyzeCaseStudy = (analysisId) => {
  const goodCard = document.getElementById("good-card");
  const badCard = document.getElementById("bad-card");
  const analysisTextEl = document.getElementById("analysis-text");

  // Remove existing highlights
  document
    .querySelectorAll(".highlight")
    .forEach((el) => el.classList.remove("highlight", "good-highlight"));

  if (analysisContent[analysisId]) {
    analysisTextEl.innerHTML = analysisContent[analysisId].text;

    // Apply highlights based on data-analysis-id attribute
    goodCard
      .querySelectorAll(`[data-analysis-id~="${analysisId}"]`)
      .forEach((el) => el.classList.add("highlight", "good-highlight"));
    badCard
      .querySelectorAll(`[data-analysis-id~="${analysisId}"]`)
      .forEach((el) => el.classList.add("highlight"));
  }
};

// Checklist methods
const addPage = () => {
  const pageName = newPageName.value.trim();
  if (pageName && !pagesData.value.some((p) => p.name === pageName)) {
    const newPage = {
      name: pageName,
      checks: {},
    };
    checklistRules.forEach((rule) => (newPage.checks[rule.id] = 0));
    pagesData.value.push(newPage);
    newPageName.value = "";
    saveData();
  } else if (pagesData.value.some((p) => p.name === pageName)) {
    alert("Une page avec ce nom existe déjà.");
  }
};

const deletePage = (pageIndex) => {
  if (
    confirm(
      `Êtes-vous sûr de vouloir supprimer la page "${pagesData.value[pageIndex].name}" ?`,
    )
  ) {
    pagesData.value.splice(pageIndex, 1);
    saveData();
  }
};

const toggleRuleState = (pageIndex, ruleId) => {
  let currentState = pagesData.value[pageIndex].checks[ruleId] || 0;
  let nextState = (currentState + 1) % 3;
  pagesData.value[pageIndex].checks[ruleId] = nextState;
  saveData();
};

const calculateCompletedRules = (page) => {
  return checklistRules.filter((rule) => (page.checks[rule.id] || 0) === 1)
    .length;
};

const calculateProgress = (page) => {
  const completedCount = calculateCompletedRules(page);
  const totalCount = checklistRules.length;
  return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
};

const getStateLabel = (state) => {
  const stateLabels = ["À faire", "Validé ✓", "Problème ✗"];
  return stateLabels[state] || stateLabels[0];
};

const getStateClasses = (state) => {
  const stateColors = [
    "text-gray-500 bg-gray-100",
    "text-green-700 bg-green-100",
    "text-red-700 bg-red-100",
  ];
  return stateColors[state] || stateColors[0];
};

const saveData = () => {
  localStorage.setItem("checklistData", JSON.stringify(pagesData.value));
};

// Mobile menu toggle
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};

// Modal methods
const openModal = (ruleId) => {
  const content = ruleExplanations[ruleId];
  if (content) {
    modalTitle.value = content.title;
    modalText.value = content.text;
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Navigation sections for sidebar
const navSections = [
  { id: "structure", title: "Structure & Disposition" },
  { id: "typographie", title: "Typographie & Lisibilité" },
  { id: "couleur", title: "Couleur & Interaction" },
  { id: "pratiques", title: "Pratiques Modernes" },
  { id: "case-study", title: "Étude de Cas" },
  { id: "checklist", title: "Checklist de Projet" },
];

const activeSection = ref("structure");

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    // Update active section after scroll, or let IntersectionObserver handle it
    // For immediate feedback, we can set it here, but observer is more robust
    activeSection.value = id;
    closeMobileMenu(); // Close menu on mobile after clicking a link
  }
};

// Intersection Observer for active section highlighting
let observer;
onMounted(() => {
  const sections = document.querySelectorAll("main section");
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    { rootMargin: "-40% 0px -60% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));

  // Chart.js initialization
  const colorCtx = document.getElementById("colorChart").getContext("2d");
  new Chart(colorCtx, {
    type: "doughnut",
    data: {
      labels: ["60% Principale", "30% Secondaire", "10% Accent"],
      datasets: [
        {
          data: [60, 30, 10],
          backgroundColor: ["#D9CDB8", "#F8F7F4", "#A59469"],
          borderColor: "#FFFFFF",
          borderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { title: (items) => items[0].label } },
      },
    },
  });

  // Event listeners for mobile menu and modal
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      isMobileMenuOpen.value = false; // Close menu if resized to desktop
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMobileMenu();
    }
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Base styles from original HTML */
* {
  box-sizing: border-box;
}

.webui-principles-tool {
  font-family: "Inter", sans-serif;
  background-color: #f8f7f4;
  color: #3d3b30;
  overflow-x: hidden;
  min-height: 100vh;
}

.nav-link {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link.active,
.nav-link:hover {
  background-color: #efebe4;
  border-left-color: #a59469;
  color: #3d3b30;
}

.card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #efebe4;
  padding: 1rem;
}

@media (min-width: 640px) {
  .card {
    padding: 1.5rem;
  }
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
  height: 150px;
}

@media (min-width: 640px) {
  .chart-container {
    max-width: 250px;
    height: 200px;
  }
}

@media (min-width: 1024px) {
  .chart-container {
    max-width: 350px;
    height: 300px;
  }
}

.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}
.flip-card-front {
  background-color: #fff;
  border: 1px solid #efebe4;
}
.flip-card-back {
  background-color: #a59469;
  color: white;
  transform: rotateY(180deg);
}

.demo-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

@media (min-width: 640px) {
  .demo-button {
    padding: 0.75rem 1.5rem;
  }
}

.demo-button.primary {
  background-color: #a59469;
  color: white;
}
.demo-button.primary:hover {
  background-color: #8c7a4b;
}
.demo-button.primary:active {
  transform: scale(0.98);
  background-color: #73643c;
}
.demo-button.primary:focus {
  border-color: #3d3b30;
}
.demo-button.primary:disabled {
  background-color: #d9cdb8;
  cursor: not-allowed;
}

.demo-button.secondary {
  background-color: transparent;
  color: #a59469;
  border: 2px solid #a59469;
}
.demo-button.secondary:hover {
  background-color: #efebe4;
}

.three-state-toggle {
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.three-state-toggle:hover {
  transform: scale(1.05);
}

.info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #efebe4;
  color: #a59469;
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
  font-style: normal;
  font-size: 10px;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .info-btn {
    width: 20px;
    height: 20px;
    margin-left: 8px;
    font-size: 12px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 95%;
  position: relative;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}

@media (min-width: 640px) {
  .modal-content {
    padding: 2rem;
    width: 90%;
  }
}

.modal-overlay.visible .modal-content {
  transform: translateY(0);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
}

.case-study-card {
  transition: all 0.3s ease;
}

.highlight {
  outline: 3px dashed #ef4444;
  outline-offset: 4px;
  transition: outline 0.3s ease;
}

.good-highlight {
  outline-color: #10b981;
}

.resource-card {
  background-color: #f8f7f4;
  border: 1px solid #efebe4;
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  transition: all 0.2s ease;
}

@media (min-width: 640px) {
  .resource-card {
    padding: 1rem;
  }
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.07);
}

/* Layout improvements */
footer {
  position: relative;
  z-index: 1;
}

/* Ensure proper spacing for mobile header */
@media (max-width: 767px) {
  #sidebar .border-b {
    margin-top: 3rem;
  }
}

/* Improve main content positioning */
main {
  position: relative;
  z-index: 1;
}
</style>
