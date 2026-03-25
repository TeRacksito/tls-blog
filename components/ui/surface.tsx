import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const surfaceVariants = cva('', {
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

function Surface({
  className,
  hasShadow,
  hasTextShadow,
  asChild = true,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof surfaceVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      className={surfaceVariants({ hasShadow, hasTextShadow, className })}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
