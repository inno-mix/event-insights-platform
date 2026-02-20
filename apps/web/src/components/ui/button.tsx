interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger:
        'px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200',
};

const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-lg px-8 py-4',
};

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
