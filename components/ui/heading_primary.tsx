import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const headingPrimaryVariants = cva('text-xl font-semibold');

function HeadingPrimary({
  className,
  ...props
}: React.ComponentProps<'h2'> & VariantProps<typeof headingPrimaryVariants>) {
  return (
    <h2 className={cn(headingPrimaryVariants({ className }))} {...props} />
  );
}

export { HeadingPrimary, headingPrimaryVariants };
