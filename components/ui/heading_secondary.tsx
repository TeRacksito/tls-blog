import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const headingSecondaryVariants = cva('text-lg font-semibold');

/**
 * Third level heading component, typically used for sub-section titles or less prominent headings.
 *
 * Primitive component rendering an `<h3>` element.
 *
 * @param className - Additional class names to apply to the heading.
 * @param props... - Other HTML attributes for the heading element.
 */
function HeadingSecondary({
  className,
  ...props
}: React.ComponentProps<'h3'> & VariantProps<typeof headingSecondaryVariants>) {
  return (
    <h3 className={cn(headingSecondaryVariants({ className }))} {...props} />
  );
}

export { HeadingSecondary, headingSecondaryVariants };
