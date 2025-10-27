<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Évaluateur de Compétences"
      description="Visualisez et exportez vos compétences de développeur sous forme de rapport PDF professionnel"
      icon="skills-evaluator"
      category="evaluation"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Sidebar (1/3) - Legend & Actions -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Skills Legend -->
          <UISection title="Légende des Niveaux" variant="glass" collapsible>
            <template #actions>
              <div class="flex items-center gap-2">
                <button
                  v-if="activeFilters.size > 0"
                  @click="clearAllFilters"
                  class="text-xs text-electric hover:text-electric-light transition-colors"
                >
                  Effacer filtres
                </button>
                <div class="text-xs text-tertiary">
                  {{
                    activeFilters.size > 0
                      ? `${activeFilters.size} filtre(s)`
                      : "Cliquez pour filtrer"
                  }}
                </div>
              </div>
            </template>

            <div class="space-y-2">
              <button
                v-for="level in skillLevels"
                :key="level.id"
                @click="toggleLevelFilter(level.range)"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-default"
                :class="
                  activeFilters.has(level.range)
                    ? 'glass-accent border border-electric shadow-sm'
                    : 'glass-light border border-primary/20 hover:glass-hover hover:border-primary/40'
                "
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: level.color }"
                  ></div>
                  <div class="text-sm">
                    <span class="font-medium text-primary">{{
                      level.range
                    }}</span>
                    <span class="text-tertiary ml-2">{{ level.label }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-xs text-tertiary font-mono">
                    {{ getSkillCountByLevel(level.range) }}
                  </div>
                  <div
                    v-if="activeFilters.has(level.range)"
                    class="text-electric"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </UISection>

          <!-- Actions -->
          <UISection title="Actions" variant="glass">
            <div class="space-y-4">
              <!-- Main Actions -->
              <div class="space-y-2">
                <UIButton
                  @click="exportToPDF"
                  :loading="isExporting"
                  variant="primary"
                  icon="clipboard"
                  size="sm"
                  :disabled="isExporting"
                  block
                >
                  {{ isExporting ? "Génération..." : "Exporter PDF" }}
                </UIButton>
              </div>

              <!-- Management Actions -->
              <div class="space-y-2 pt-2 border-t border-primary/20">
                <UIButton
                  @click="showAddSkillModal = true"
                  variant="ghost"
                  icon="plus"
                  size="sm"
                  block
                >
                  Ajouter Compétence
                </UIButton>
                <UIButton
                  @click="showAddCategoryModal = true"
                  variant="ghost"
                  icon="plus"
                  size="sm"
                  block
                >
                  Nouvelle Catégorie
                </UIButton>
              </div>

              <!-- Info Text -->
              <div
                class="text-xs text-tertiary pt-3 border-t border-primary/20"
              >
                💡 Cliquez sur les compétences pour ajuster les niveaux. Les
                modifications ne sont pas sauvegardées entre les sessions.
              </div>
            </div>
          </UISection>
        </div>

        <!-- Right Content (2/3) - Skills Categories -->
        <div class="lg:col-span-2 space-y-6">
          <UISection
            v-for="(category, categoryIndex) in filteredSkillsData"
            :key="category.category"
            :title="category.category"
            variant="glass"
            collapsible
            :class="`animate-slide-up`"
            :style="{ animationDelay: `${categoryIndex * 150}ms` }"
          >
            <template #actions v-if="activeFilters.size > 0">
              <div class="text-xs text-tertiary">
                {{ category.skills.length }} compétence(s)
              </div>
            </template>

            <div
              v-if="category.skills.length === 0 && activeFilters.size > 0"
              class="text-center py-8"
            >
              <div class="text-tertiary text-sm">
                Aucune compétence ne correspond aux filtres sélectionnés dans
                cette catégorie
              </div>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(skill, skillIndex) in category.skills"
                :key="skill.name"
                class="group p-4 rounded-lg transition-default cursor-pointer"
                :class="
                  editingSkill === skill.id
                    ? 'glass-accent border border-electric'
                    : 'glass-light hover:glass-hover'
                "
                @click="toggleSkillEdit(skill.id)"
                :style="{
                  animationDelay: `${categoryIndex * 100 + skillIndex * 50}ms`,
                }"
              >
                <!-- Skill Header -->
                <div class="flex items-center justify-between mb-3">
                  <h4
                    class="font-medium text-primary group-hover:text-electric transition-colors"
                  >
                    {{ skill.name }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-mono text-secondary"
                      >{{ skill.level }}/10</span
                    >
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: getSkillColor(skill.level) }"
                    ></div>
                  </div>
                </div>

                <!-- Skill Bar -->
                <div class="relative">
                  <div
                    class="w-full h-3 bg-glass-light rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                      :style="{
                        width: `${skill.level * 10}%`,
                        backgroundColor: getSkillColor(skill.level),
                      }"
                    >
                      <!-- Animated stripes on hover -->
                      <div
                        class="absolute inset-0 opacity-0 group-hover:opacity-30 skill-stripes transition-opacity duration-300"
                      ></div>
                    </div>
                  </div>

                  <!-- Level adjustment when editing -->
                  <div v-if="editingSkill === skill.id" class="mt-3">
                    <input
                      type="range"
                      :value="skill.level"
                      @input="
                        updateSkillLevel(
                          skill.id,
                          parseInt($event.target.value),
                        )
                      "
                      min="0"
                      max="10"
                      class="w-full slider"
                    />
                    <div
                      class="flex justify-between text-xs text-tertiary mt-1"
                    >
                      <span>0 - Inconnu</span>
                      <span>5 - Compétent</span>
                      <span>10 - Expert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UISection>
        </div>
      </div>
    </div>

    <!-- Add Skill Modal -->
    <div
      v-if="showAddSkillModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddSkillModal = false"
    >
      <div class="glass-modal p-6 rounded-xl max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-medium text-primary mb-4">
          Ajouter une Compétence
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Nom de la compétence</label
            >
            <input
              v-model="newSkill.name"
              type="text"
              placeholder="ex: React Native"
              class="w-full px-3 py-2 glass-light rounded-lg border border-primary/20 text-primary placeholder-tertiary focus:border-electric focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Catégorie</label
            >
            <select
              v-model="newSkill.category"
              class="w-full px-3 py-2 glass-light rounded-lg border border-primary/20 text-primary focus:border-electric focus:outline-none"
            >
              <option
                v-for="category in skillsData"
                :key="category.category"
                :value="category.category"
              >
                {{ category.category }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Niveau initial: {{ newSkill.level }}/10</label
            >
            <input
              v-model="newSkill.level"
              type="range"
              min="0"
              max="10"
              class="w-full slider"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <UIButton @click="addSkill" variant="primary" size="sm" class="flex-1"
            >Ajouter</UIButton
          >
          <UIButton
            @click="showAddSkillModal = false"
            variant="secondary"
            size="sm"
            class="flex-1"
            >Annuler</UIButton
          >
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div
      v-if="showAddCategoryModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddCategoryModal = false"
    >
      <div class="glass-modal p-6 rounded-xl max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-medium text-primary mb-4">
          Nouvelle Catégorie
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary mb-2"
              >Nom de la catégorie</label
            >
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="ex: Outils de Design"
              class="w-full px-3 py-2 glass-light rounded-lg border border-primary/20 text-primary placeholder-tertiary focus:border-electric focus:outline-none"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <UIButton
            @click="addCategory"
            variant="primary"
            size="sm"
            class="flex-1"
            >Créer</UIButton
          >
          <UIButton
            @click="showAddCategoryModal = false"
            variant="secondary"
            size="sm"
            class="flex-1"
            >Annuler</UIButton
          >
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-16 border-t border-primary glass-light">
      <div class="container mx-auto py-6 px-4 text-center text-tertiary">
        <p>
          &copy; 2025 - Évaluateur de compétences interactif. Créez votre profil
          professionnel.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { UISection, UIButton } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";

// State
const isExporting = ref(false);
const editingSkill = ref(null);
const showAddSkillModal = ref(false);
const showAddCategoryModal = ref(false);
const newCategoryName = ref("");
const activeFilters = ref(new Set()); // Track active level filters

// New skill form
const newSkill = reactive({
  name: "",
  category: "Développement Frontend",
  level: 5,
});

// Skill levels configuration
const skillLevels = [
  { id: 0, range: "0", label: "Inconnu", color: "#7F1D1D" },
  { id: 1, range: "1-3", label: "Novice", color: "#DC2626" },
  { id: 2, range: "4-6", label: "Compétent", color: "#00D4FF" },
  { id: 3, range: "7-8", label: "Avancé", color: "#22C55E" },
  { id: 4, range: "9-10", label: "Expert", color: "#15803D" },
];

// Skills data using our electric blue theme
const skillsData = reactive([
  {
    category: "Développement Frontend",
    skills: [
      { id: 1, name: "HTML5", level: 8 },
      { id: 2, name: "CSS & Pré-processeurs (Sass)", level: 8 },
      { id: 3, name: "JavaScript (ES6+)", level: 8 },
      { id: 4, name: "TypeScript", level: 5 },
      { id: 5, name: "Vue.js (Composition API)", level: 7 },
      { id: 6, name: "React", level: 0 },
      { id: 7, name: "Svelte / SvelteKit", level: 3 },
      { id: 8, name: "Pinia (Vue)", level: 3 },
      { id: 9, name: "Tailwind CSS", level: 8 },
      { id: 10, name: "Bibliothèques de Composants", level: 1 },
      { id: 11, name: "Tests Unitaires (Jest / Vitest)", level: 1 },
      { id: 12, name: "REST APIs & Fetch/Axios", level: 10 },
      { id: 13, name: "Accessibilité (WCAG)", level: 5 },
      { id: 14, name: "Performance Web", level: 5 },
      { id: 15, name: "WEBDEV 2025", level: 2 },
    ],
  },
  {
    category: "Développement Backend",
    skills: [
      { id: 16, name: "Node.js", level: 7 },
      { id: 17, name: "Python", level: 9 },
      { id: 18, name: "Django (Python)", level: 3 },
      { id: 19, name: "Flask (Python)", level: 7 },
      { id: 20, name: "SQL (PostgreSQL, MySQL)", level: 6 },
      { id: 21, name: "Redis", level: 5 },
      { id: 22, name: "Conception d'API REST", level: 7 },
      { id: 23, name: "JWT / OAuth", level: 1 },
      { id: 24, name: "Docker & Docker Compose", level: 6 },
      { id: 25, name: "SQLAlchemy", level: 5 },
      { id: 26, name: "Entity Framework", level: 4 },
      { id: 27, name: "WINDEV 2025", level: 2 },
    ],
  },
  {
    category: "Outils & DevOps",
    skills: [
      { id: 28, name: "Git & GitHub/GitLab", level: 9 },
      { id: 29, name: "PCSOFT GDS", level: 3 },
      { id: 30, name: "CI/CD (GitHub Actions)", level: 1 },
      { id: 31, name: "Outils de Build (Vite)", level: 5 },
      { id: 32, name: "Méthodologies Agile / Scrum", level: 7 },
      { id: 33, name: "Jira / Trello", level: 5 },
    ],
  },
]);

// Computed properties
const filteredSkillsData = computed(() => {
  if (activeFilters.value.size === 0) {
    return skillsData;
  }

  return skillsData
    .map((category) => ({
      ...category,
      skills: category.skills.filter((skill) => {
        return Array.from(activeFilters.value).some((range) => {
          if (range === "0") return skill.level === 0;
          if (range === "1-3") return skill.level >= 1 && skill.level <= 3;
          if (range === "4-6") return skill.level >= 4 && skill.level <= 6;
          if (range === "7-8") return skill.level >= 7 && skill.level <= 8;
          if (range === "9-10") return skill.level >= 9 && skill.level <= 10;
          return false;
        });
      }),
    }))
    .filter(
      (category) =>
        category.skills.length > 0 || activeFilters.value.size === 0,
    );
});

// Methods
const getSkillColor = (level) => {
  if (level === 0) return "#7F1D1D";
  if (level >= 1 && level <= 3) return "#DC2626";
  if (level >= 4 && level <= 6) return "#00D4FF";
  if (level >= 7 && level <= 8) return "#22C55E";
  if (level >= 9 && level <= 10) return "#15803D";
  return "#64748B";
};

const getSkillCountByLevel = (range) => {
  const allSkills = skillsData.flatMap((category) => category.skills);

  if (range === "0") {
    return allSkills.filter((skill) => skill.level === 0).length;
  } else if (range === "1-3") {
    return allSkills.filter((skill) => skill.level >= 1 && skill.level <= 3)
      .length;
  } else if (range === "4-6") {
    return allSkills.filter((skill) => skill.level >= 4 && skill.level <= 6)
      .length;
  } else if (range === "7-8") {
    return allSkills.filter((skill) => skill.level >= 7 && skill.level <= 8)
      .length;
  } else if (range === "9-10") {
    return allSkills.filter((skill) => skill.level >= 9 && skill.level <= 10)
      .length;
  }

  return 0;
};

const toggleSkillEdit = (skillId) => {
  editingSkill.value = editingSkill.value === skillId ? null : skillId;
};

const toggleLevelFilter = (range) => {
  if (activeFilters.value.has(range)) {
    activeFilters.value.delete(range);
  } else {
    activeFilters.value.add(range);
  }
  // Trigger reactivity
  activeFilters.value = new Set(activeFilters.value);
};

const clearAllFilters = () => {
  activeFilters.value = new Set();
};

const updateSkillLevel = (skillId, newLevel) => {
  // Find and update skill level across all categories
  for (const category of skillsData) {
    const skill = category.skills.find((s) => s.id === skillId);
    if (skill) {
      skill.level = newLevel;
      break;
    }
  }
};

const addSkill = () => {
  if (!newSkill.name.trim()) return;

  // Find the category to add to
  const category = skillsData.find((cat) => cat.category === newSkill.category);
  if (category) {
    // Generate new ID
    const maxId = Math.max(
      ...skillsData.flatMap((cat) => cat.skills.map((skill) => skill.id)),
    );

    category.skills.push({
      id: maxId + 1,
      name: newSkill.name.trim(),
      level: newSkill.level,
    });
  }

  // Reset form and close modal
  newSkill.name = "";
  newSkill.level = 5;
  showAddSkillModal.value = false;
};

const addCategory = () => {
  if (!newCategoryName.value.trim()) return;

  // Check if category already exists
  const exists = skillsData.some(
    (cat) =>
      cat.category.toLowerCase() === newCategoryName.value.trim().toLowerCase(),
  );
  if (exists) return;

  // Add new category
  skillsData.push({
    category: newCategoryName.value.trim(),
    skills: [],
  });

  // Reset form and close modal
  newCategoryName.value = "";
  showAddCategoryModal.value = false;
};

const exportToPDF = async () => {
  try {
    isExporting.value = true;

    // Dynamically import the required libraries
    const [html2canvas, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Colors for PDF
    const colors = {
      primary: [0, 212, 255], // Electric blue
      text: [55, 65, 81], // Dark gray
      textLight: [107, 114, 128], // Light gray
      background: [248, 250, 252], // Very light gray
    };

    // Header
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, 210, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Profil de Compétences", 20, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Évaluation des compétences techniques", 20, 26);

    // Legend section
    let yPosition = 45;
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Légende des niveaux", 20, yPosition);

    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const legendItems = [
      { range: "0", label: "Inconnu", color: [127, 29, 29] },
      { range: "1-3", label: "Novice", color: [220, 38, 38] },
      { range: "4-6", label: "Compétent", color: [0, 212, 255] },
      { range: "7-8", label: "Avancé", color: [34, 197, 94] },
      { range: "9-10", label: "Expert", color: [21, 128, 61] },
    ];

    legendItems.forEach((item, index) => {
      const xPos = 20 + index * 35;

      // Color circle
      pdf.setFillColor(...item.color);
      pdf.circle(xPos + 2, yPosition + 1.5, 1.5, "F");

      // Text
      pdf.setTextColor(...colors.text);
      pdf.text(`${item.range}: ${item.label}`, xPos + 6, yPosition + 2);
    });

    yPosition += 15;

    // Skills sections
    for (const category of skillsData) {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Category header with background
      pdf.setFillColor(240, 242, 247);
      pdf.rect(15, yPosition - 5, 180, 12, "F");

      pdf.setTextColor(...colors.text);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(category.category, 20, yPosition + 2);

      yPosition += 15;

      // Skills in this category
      for (const skill of category.skills) {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        // Single row layout: "HTML5    7/10  [colored striped bar]"
        const skillName = skill.name;
        const levelText = `${skill.level}/10`;

        // Layout positions
        const nameX = 25;
        const levelX = 110;
        const barX = 140;
        const barWidth = 50;
        const barHeight = 6;

        // Skill name
        pdf.setTextColor(...colors.text);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(skillName, nameX, yPosition);

        // Level indicator
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...colors.textLight);
        pdf.text(levelText, levelX, yPosition);

        // Skill bar background (light gray)
        pdf.setFillColor(229, 231, 235);
        pdf.rect(barX, yPosition - 3, barWidth, barHeight, "F");

        // Skill bar fill with stripes
        const fillWidth = (skill.level / 10) * barWidth;
        const skillColor = getSkillColorRGB(skill.level);

        if (fillWidth > 0) {
          // Main colored fill
          pdf.setFillColor(...skillColor);
          pdf.rect(barX, yPosition - 3, fillWidth, barHeight, "F");

          // Add stripe pattern (alternating lighter color)
          const lighterColor = skillColor.map((c) => Math.min(255, c + 40));
          pdf.setFillColor(...lighterColor);

          // Create stripes by drawing thin rectangles
          for (let i = 0; i < fillWidth; i += 4) {
            pdf.rect(barX + i, yPosition - 3, 2, barHeight, "F");
          }
        }

        // Bar border
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(barX, yPosition - 3, barWidth, barHeight, "S");

        yPosition += 12;
      }

      yPosition += 8; // Extra space between categories
    }

    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setTextColor(...colors.textLight);
      pdf.setFontSize(9);
      pdf.text(`Page ${i} sur ${pageCount}`, 20, 290);
      pdf.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 130, 290);
    }

    pdf.save("profil-competences.pdf");
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    alert("Une erreur est survenue lors de l'export PDF.");
  } finally {
    isExporting.value = false;
  }
};

// Helper function to get RGB color for PDF
const getSkillColorRGB = (level) => {
  if (level === 0) return [127, 29, 29];
  if (level >= 1 && level <= 3) return [220, 38, 38];
  if (level >= 4 && level <= 6) return [0, 212, 255];
  if (level >= 7 && level <= 8) return [34, 197, 94];
  if (level >= 9 && level <= 10) return [21, 128, 61];
  return [100, 116, 139];
};
</script>

<style scoped>
/* Animations */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
  opacity: 0;
}

/* Skill bar stripes animation */
@keyframes progress-stripes {
  0% {
    background-position-x: 1rem;
  }
}

.skill-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progress-stripes 1s linear infinite;
}

/* Range slider styling */
.slider {
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

/* Modal styling */
.glass-modal {
  background: var(--glass-modal-bg);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-modal);
}
</style>
