export function OptionButton({ label, selected, onClick }) {
  return `
    <button class="option-button ${selected ? "is-selected" : ""}" type="button" aria-pressed="${selected}" data-option="${label}">
      ${label}
    </button>
  `;
}
