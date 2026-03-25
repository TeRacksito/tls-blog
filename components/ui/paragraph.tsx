import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const paragraphVariants = cva('', {
  variants: {
    as: {
      p: '',
      span: 'inline',
    },
    size: {
      default: '',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    as: 'p',
    size: 'default',
  },
});

function Paragraph({
  className,
  as = 'p',
  size = 'default',
  asChild = false,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof paragraphVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : as || 'p';

  return (
    <Comp
      data-slot="paragraph"
      className={cn(paragraphVariants({ as, size, className }))}
      {...props}
    />
  );
}

export { Paragraph, paragraphVariants };
