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

/**
 * Paragraph component for block and inline text content.
 *
 * Primitive component that can render as a `<p>` or `<span>` element.
 *
 * @param className - Additional class names to apply to the paragraph.
 * @param as - The HTML element to render, either 'p' or 'span'. This determines block or inline behavior.
 * @param size - The size variant of the paragraph text.
 * @param asChild - If true, renders the component as a child of another component using Radix's Slot.
 * @param props... - Other HTML attributes for the paragraph element.
 */
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
