# UI STYLE GUIDE (Tailwind-Driven)

## Единый источник правды
- **Все цвета, размеры, радиусы, gap, типографика** — только из `tailwind.config.ts`.
- **Запрещено** использовать кастомные CSS-классы для типографики, цветов, радиусов, gap и т.д. вне Tailwind.
- **Все новые стили** добавляются только через расширение Tailwind config.

## Разрешённые токены (tailwind.config.ts)

### Цвета
- bg-prim, bg-sec, bg-tert
- fill-prim, fill-sec
- brd-prim, brd-sec, brd-tert
- accent-prim, accent-sec, accent-destructive
- content-prim, content-sec, content-tert
- sidebar, card, popover, muted, destructive, primary, secondary, accent

### Радиусы
- xs, sm, md, lg, full (см. theme.borderRadius)

### Типографика
- fontFamily: 'Inter var', Inter, sans-serif
- fontSize/fontWeight/lineHeight/letterSpacing: только через tailwind config (см. ниже)

### Пример типографических токенов (добавить в theme.extend.fontSize):
- p-m-bold: [12px, { lineHeight: '16px', fontWeight: '600', letterSpacing: '-0.02em' }]
- p-l-bold: [13px, { lineHeight: '16px', fontWeight: '600', letterSpacing: '-0.02em' }]
- h-xl: [24px, { lineHeight: '28px', fontWeight: '700' }]

### Gap
- gap-section-xs: 0.25rem (через utilities)

### Кастомизация через Tailwind
- Запрещено добавлять новые кастомные токены (например, 'btn-m', 'btn-l') для padding, gap и т.д. в scale Tailwind.
- Использовать только стандартные значения Tailwind (например, px-1.5, px-3, px-4 и т.д.).
- Если нужно изменить padding — менять существующее значение (например, px-3), а не добавлять новые кастомные имена.

### Кнопки (Button)
- **Размер m**: padding px-3 py-1.5 (12px 6px), gap 4px, иконка 16px, label container без padding
- **Размер l**: padding px-4 py-2 (16px 8px), gap 4px, иконка 20px, label container padding 2px 0px
- **Label text** (оба размера): font-size: 13px, font-weight: 600, line-height: 16px, letter-spacing: -0.26px (токен text-p-m-bold/text-p-l-bold)

#### Пример
```tsx
<Button size="m" className="text-p-m-bold">Label</Button>
<Button size="l" className="text-p-l-bold">Label</Button>
```

## Как добавлять новые стили
1. Добавить токен в `tailwind.config.ts` (theme.extend).
2. Использовать только tailwind-классы в компонентах.
3. Любой новый UI-стиль — только через config и ревью.

## Запрещено
- Инлайн-стили (style={}) для цветов, типографики, радиусов, gap.
- Кастомные классы вне tailwind (например, .text-style-p-m-bold в CSS).
- Использование неразрешённых токенов.

## Пример использования
```tsx
<button className="bg-accent-prim text-content-prim rounded-md px-4 py-2 text-p-m-bold">Button</button>
```

---

> Любое отклонение от этого гайда требует отдельного согласования и фиксации в этом файле. 