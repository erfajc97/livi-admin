import { heroui } from '@heroui/react'

/* Tema HeroUI del panel LIVI.
 *
 * Motivo del cambio: los fondos/contenidos de HeroUI se quedaban con los
 * defaults y, combinados con los tokens beige/butter de `styles.css`, el panel
 * se veía amarillo. Ahora `background` y `content1..4` se declaran de forma
 * explícita con la misma paleta de la tienda (livi-web): base blanca y una
 * escalera neutra cálida. El butter solo sobrevive como color de texto sobre
 * burgundy/dorado (acento intencional de marca).
 */
const semantic = {
  background: '#FFFFFF', // blanco — base, igual que la tienda
  foreground: '#231815', // espresso
  content1: '#FFFFFF', // tarjetas / superficies
  content2: '#F4F1EC', // zonas alternas (bg-alt)
  content3: '#EDE9E0', // border-soft
  content4: '#E5E0D7', // border
  primary: {
    DEFAULT: '#4D0E12', // burgundy LIVI
    foreground: '#F5EFC6', // butter sobre burgundy — acento intencional
  },
  danger: {
    DEFAULT: '#B23B3B',
    foreground: '#FFFFFF',
  },
  success: {
    DEFAULT: '#65754F',
    foreground: '#FFFFFF',
  },
  warning: {
    DEFAULT: '#B07A1E',
    foreground: '#F5EFC6', // butter sobre dorado — acento intencional
  },
}

export default heroui({
  defaultTheme: 'light',
  themes: {
    light: { colors: semantic },
    // El panel solo se usa en claro; se replica para que un `.dark` accidental
    // no devuelva los defaults grises/oscuros de HeroUI.
    dark: { colors: semantic },
  },
})
