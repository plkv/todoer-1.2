import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	safelist: [
		'card-bg-red', 'card-bg-red-hover',
		'card-bg-orange', 'card-bg-orange-hover',
		'card-bg-yellow', 'card-bg-yellow-hover',
		'card-bg-green', 'card-bg-green-hover',
		'card-bg-blue', 'card-bg-blue-hover',
		'card-bg-purple', 'card-bg-purple-hover',
		'card-bg-gray', 'card-bg-gray-hover',
	],
	theme: {
		fontSize: {
			base: ['13px', '16px'],
			xs: ['11px', '16px'],
			sm: ['12px', '16px'],
			xl: ['18px', '24px'],
			'3xl': ['24px', '28px'],
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter var', 'Inter', 'sans-serif'],
			},
			colors: {
				'bg-prim': 'hsl(var(--bg-prim))',
				'bg-sec': 'hsl(var(--bg-sec))',
				'bg-tert': 'hsl(var(--bg-tert))',
				'fill-prim': 'hsl(var(--fill-prim))',
				'fill-sec': 'hsl(var(--fill-sec))',
				'brd-prim': 'hsl(var(--brd-prim))',
				'brd-sec': 'hsl(var(--brd-sec))',
				'brd-tert': 'hsl(var(--brd-tert))',
				'accent-prim': 'hsl(var(--accent-prim))',
				'accent-sec': 'hsl(var(--accent-sec))',
				'accent-destructive': 'hsl(var(--accent-destructive))',
				'content-prim': 'hsl(var(--content-prim))',
				'content-sec': 'hsl(var(--content-sec))',
				'content-tert': 'hsl(var(--content-tert))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				xs: 'var(--radius-xs)',
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				full: 'var(--radius-full)',
				'btn': '6px',
				'btn-xl': '12px',
				'2': '2px',
				'4': '4px',
				'6': '6px',
				'10': '10px',
				'12': '12px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: theme => ({
				'card-bg-red': 'linear-gradient(rgba(255,71,66,0.12), rgba(255,71,66,0.12))',
				'card-bg-red-hover': 'linear-gradient(rgba(255,71,66,0.20), rgba(255,71,66,0.20))',
				'card-bg-orange': 'linear-gradient(rgba(255,159,10,0.12), rgba(255,159,10,0.12))',
				'card-bg-orange-hover': 'linear-gradient(rgba(255,159,10,0.20), rgba(255,159,10,0.20))',
				'card-bg-yellow': 'linear-gradient(rgba(255,221,51,0.12), rgba(255,221,51,0.12))',
				'card-bg-yellow-hover': 'linear-gradient(rgba(255,221,51,0.20), rgba(255,221,51,0.20))',
				'card-bg-green': 'linear-gradient(rgba(0,204,102,0.12), rgba(0,204,102,0.12))',
				'card-bg-green-hover': 'linear-gradient(rgba(0,204,102,0.20), rgba(0,204,102,0.20))',
				'card-bg-blue': 'linear-gradient(rgba(51,153,255,0.12), rgba(51,153,255,0.12))',
				'card-bg-blue-hover': 'linear-gradient(rgba(51,153,255,0.20), rgba(51,153,255,0.20))',
				'card-bg-purple': 'linear-gradient(rgba(153,102,255,0.12), rgba(153,102,255,0.12))',
				'card-bg-purple-hover': 'linear-gradient(rgba(153,102,255,0.20), rgba(153,102,255,0.20))',
				'card-bg-gray': 'linear-gradient(rgba(160,160,160,0.12), rgba(160,160,160,0.12))',
				'card-bg-gray-hover': 'linear-gradient(rgba(160,160,160,0.20), rgba(160,160,160,0.20))',
			}),
			spacing: {
				'btn-m': '28px',
				'btn-l': '36px',
				'icon-m': '16px',
				'icon-l': '20px',
				'6': '6px',
				'32': '32px',
				'52': '52px',
				'80': '80px',
				'100': '100px',
				'140': '140px',
				'300': '300px',
				'420': '420px',
				'520': '520px',
				'1px': '1px',
				'2px': '2px',
				'4px': '4px',
				'10px': '10px',
				'12px': '12px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
