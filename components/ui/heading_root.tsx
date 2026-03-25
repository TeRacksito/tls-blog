import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const headingRootVariants = cva('text-4xl font-bold');

/**
 * First level heading component, typically used for the main title of a page or section.
 *
 * Primitive component rendering an `<h1>` element.
 *
 * @param className - Additional class names to apply to the heading.
 * @param props... - Other HTML attributes for the heading element.
 */
function HeadingRoot({
  className,
  ...props
}: React.ComponentProps<'h1'> & VariantProps<typeof headingRootVariants>) {
  return <h1 className={cn(headingRootVariants({ className }))} {...props} />;
}

export { HeadingRoot, headingRootVariants };
