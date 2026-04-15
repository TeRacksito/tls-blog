import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const headingPrimaryVariants = cva('text-xl font-semibold');

/**
 * Second level heading component, typically used for section titles or important subheadings.
 *
 * Primitive component rendering an `<h2>` element.
 *
 * @param className - Additional class names to apply to the heading.
 * @param props... - Other HTML attributes for the heading element.
 */
function HeadingPrimary({
  className,
  ...props
}: React.ComponentProps<'h2'> & VariantProps<typeof headingPrimaryVariants>) {
  return (
    <h2 className={cn(headingPrimaryVariants({ className }))} {...props} />
  );
}

export { HeadingPrimary, headingPrimaryVariants };
