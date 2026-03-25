import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const headingSecondaryVariants = cva('text-lg font-semibold');

function HeadingSecondary({
  className,
  ...props
}: React.ComponentProps<'h3'> & VariantProps<typeof headingSecondaryVariants>) {
  return (
    <h3 className={cn(headingSecondaryVariants({ className }))} {...props} />
  );
}

export { HeadingSecondary, headingSecondaryVariants };
