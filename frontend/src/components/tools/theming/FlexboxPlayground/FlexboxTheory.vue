<template>
  <div class="space-y-4">
    <!-- Concepts Fundamentaux -->
    <div class="theory-section">
      <h4 class="section-title">📦 Concepts de Base</h4>
      <p class="section-content">
        <strong>Conteneur Flex :</strong> L'élément parent avec
        <code>display: flex</code><br />
        <strong>Éléments Flex :</strong> Les enfants directs du conteneur<br />
        <strong>Axe Principal :</strong> Direction définie par flex-direction<br />
        <strong>Axe Transversal :</strong> Perpendiculaire à l'axe principal
      </p>
    </div>

    <!-- Axes -->
    <div class="theory-section">
      <h4 class="section-title">🧭 Système d'Axes</h4>
      <p class="section-content">
        <strong>Row (défaut) :</strong> Axe principal = horizontal →<br />
        <strong>Column :</strong> Axe principal = vertical ↓<br />
        <strong>Justify-content :</strong> Aligne sur l'axe principal<br />
        <strong>Align-items :</strong> Aligne sur l'axe transversal
      </p>
    </div>

    <!-- Comparaison Grid vs Flex -->
    <div class="theory-section">
      <h4 class="section-title">🔲 Flexbox vs Grid</h4>
      <p class="section-content">
        <strong>Flexbox (1D) :</strong> Une dimension, contenu-vers-layout<br />
        • Idéal pour barres de navigation, boutons, alignement<br />
        • Taille selon le contenu, flexible<br /><br />
        <strong>Grid (2D) :</strong> Deux dimensions, layout-vers-contenu<br />
        • Idéal pour pages complètes, grilles complexes<br />
        • Taille définie explicitement, rigide
      </p>
    </div>

    <!-- Propriétés Clés -->
    <div class="theory-section">
      <h4 class="section-title">🔧 Propriétés Essentielles</h4>
      <div class="properties-grid">
        <div class="property-item">
          <strong>justify-content</strong>
          <span>Alignement principal</span>
        </div>
        <div class="property-item">
          <strong>align-items</strong>
          <span>Alignement transversal</span>
        </div>
        <div class="property-item">
          <strong>flex-grow</strong>
          <span>Croissance de l'élément</span>
        </div>
        <div class="property-item">
          <strong>flex-shrink</strong>
          <span>Rétrécissement</span>
        </div>
        <div class="property-item">
          <strong>flex-basis</strong>
          <span>Taille de base</span>
        </div>
        <div class="property-item">
          <strong>align-self</strong>
          <span>Alignement individuel</span>
        </div>
      </div>
    </div>

    <!-- Cas d'Usage -->
    <div class="theory-section">
      <h4 class="section-title">🎯 Cas d'Usage Courants</h4>
      <div class="use-cases">
        <div class="use-case">
          <strong>Centrer un élément :</strong>
          <code>justify-content: center; align-items: center;</code>
        </div>
        <div class="use-case">
          <strong>Navbar responsive :</strong>
          <code>justify-content: space-between;</code>
        </div>
        <div class="use-case">
          <strong>Sidebar + contenu :</strong>
          <code>sidebar: flex-basis: 200px; content: flex-grow: 1;</code>
        </div>
        <div class="use-case">
          <strong>Grille de cartes :</strong>
          <code>flex-wrap: wrap; justify-content: space-around;</code>
        </div>
      </div>
    </div>

    <!-- Conseils -->
    <div class="theory-section">
      <h4 class="section-title">💡 Conseils Pratiques</h4>
      <ul class="tips-list">
        <li>Utilisez Flexbox pour les layouts en 1 dimension</li>
        <li>Grid est mieux pour les layouts en 2 dimensions</li>
        <li>
          <code>flex: 1</code> =
          <code>flex-grow: 1; flex-shrink: 1; flex-basis: 0;</code>
        </li>
        <li>
          Attention au <code>min-width/height</code> sur les éléments flex
        </li>
        <li>Les marges auto poussent les éléments aux extrêmes</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.theory-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.section-content strong {
  color: rgba(255, 255, 255, 0.95);
}

.section-content code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 11px;
}

.properties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.property-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 6px;
  font-size: 11px;
}

.property-item strong {
  display: block;
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  margin-bottom: 2px;
}

.property-item span {
  color: rgba(255, 255, 255, 0.7);
}

.use-cases {
  space-y: 8px;
}

.use-case {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 6px;
  font-size: 11px;
  margin-bottom: 8px;
}

.use-case strong {
  display: block;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 4px;
}

.use-case code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.tips-list {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  padding-left: 16px;
}

.tips-list li {
  margin-bottom: 6px;
  line-height: 1.4;
}

.tips-list code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 11px;
}
</style>
