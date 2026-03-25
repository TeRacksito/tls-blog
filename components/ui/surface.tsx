import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const surfaceVariants = cva('transition-shadow', {
  variants: {
    hasShadow: {
      true: 'shadow-md',
      false: 'shadow-none',
    },
    hasTextShadow: {
      true: 'text-shadow-[var(--shadow-md-base)_var(--shadow-md-color)]',
      false: 'text-shadow-none',
    },
  },
  defaultVariants: {
    hasShadow: false,
    hasTextShadow: false,
  },
});

/**
 * Surface component for applying styles such as shadows to its child content.
 *
 * Primitive component that can wrap any content and apply visual styles based on the provided variants.
 *
 * @param className - Additional class names to apply to the surface.
 * @param hasShadow - Whether to apply a shadow effect to the surface.
 * @param hasTextShadow - Whether to apply a text shadow effect to the content within the surface.
 * @param props... - Other HTML attributes for the surface element. It requires a child element to render its content.
 */
function Surface({
  className,
  hasShadow,
  hasTextShadow,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, 'children'> &
  VariantProps<typeof surfaceVariants> & { children: React.ReactElement }) {
  const Comp = Slot.Root;
  return (
    <Comp
      className={surfaceVariants({ hasShadow, hasTextShadow, className })}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
