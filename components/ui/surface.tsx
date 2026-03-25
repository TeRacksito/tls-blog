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
