import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const headingRootVariants = cva('text-4xl font-bold ');

function HeadingRoot({
  className,
  ...props
}: React.ComponentProps<'h1'> & VariantProps<typeof headingRootVariants>) {
  return <h1 className={cn(headingRootVariants({ className }))} {...props} />;
}

export { HeadingRoot, headingRootVariants };
