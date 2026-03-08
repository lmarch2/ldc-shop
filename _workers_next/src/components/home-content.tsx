"use client"

import { useDeferredValue, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Boxes, Heart, Layers3, Search, SlidersHorizontal, Sparkles, Users } from "lucide-react"
import { AnnouncementPopup } from "@/components/announcement-popup"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { StarRatingStatic } from "@/components/star-rating-static"
import { NavigationPill } from "@/components/navigation-pill"
import { useI18n } from "@/lib/i18n/context"
import { INFINITE_STOCK } from "@/lib/constants"

interface Product {
    id: string
    name: string
    description: string | null
    descriptionPlain?: string | null
    price: string
    compareAtPrice?: string | null
    image: string | null
    category: string | null
    stockCount: number
    soldCount: number
    isHot?: boolean | null
    rating?: number
    reviewCount?: number
}

interface HomeContentProps {
    products: Product[]
    announcement?: {
        banner: string | null
        popup: {
            title: string | null
            content: string
            signature: string
        } | null
    } | null
    visitorCount?: number
    categories?: string[]
    categoryConfig?: Array<{ name: string; icon: string | null; sortOrder: number }>
    pendingOrders?: Array<{ orderId: string; createdAt: Date; productName: string; amount: string }>
    wishlistEnabled?: boolean
    filters: { q?: string; category?: string | null; sort?: string }
    pagination: { page: number; pageSize: number; total: number }
}

export function HomeContent({ products, announcement, visitorCount, categories = [], categoryConfig, pendingOrders, wishlistEnabled = false, filters, pagination }: HomeContentProps) {
    const { t } = useI18n()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(filters.category || null)
    const [searchTerm, setSearchTerm] = useState(filters.q || "")
    const [sortKey, setSortKey] = useState(filters.sort || "default")
    const [page, setPage] = useState(pagination.page || 1)
    const deferredSearch = useDeferredValue(searchTerm)

    useEffect(() => {
        setPage(1)
    }, [selectedCategory, sortKey, deferredSearch])

    const filteredProducts = useMemo(() => {
        const keyword = deferredSearch.trim().toLowerCase()
        return products.filter((product) => {
            if (selectedCategory && product.category !== selectedCategory) return false
            if (!keyword) return true
            const name = (product.name || "").toLowerCase()
            const desc = (product.descriptionPlain || product.description || "").toLowerCase()
            return name.includes(keyword) || desc.includes(keyword)
        })
    }, [products, selectedCategory, deferredSearch])

    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts]
        switch (sortKey) {
            case "priceAsc":
                return list.sort((a, b) => Number(a.price) - Number(b.price))
            case "priceDesc":
                return list.sort((a, b) => Number(b.price) - Number(a.price))
            case "stockDesc":
                return list.sort((a, b) => (b.stockCount || 0) - (a.stockCount || 0))
            case "soldDesc":
                return list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
            case "hot":
                return list.sort((a, b) => Number(!!b.isHot) - Number(!!a.isHot))
            default:
                return list
        }
    }, [filteredProducts, sortKey])

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pagination.pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pagination.pageSize
    const pageItems = sortedProducts.slice(startIndex, startIndex + pagination.pageSize)
    const hasMore = currentPage < totalPages
    const highlightedCategories = categories.slice(0, 4)
    const sortOptions = [
        { key: "default", label: t("home.sort.default") },
        { key: "stockDesc", label: t("home.sort.stock") },
        { key: "soldDesc", label: t("home.sort.sold") },
        { key: "priceAsc", label: t("home.sort.priceAsc") },
        { key: "priceDesc", label: t("home.sort.priceDesc") },
    ] as const
    const heroMetrics = [
        {
            key: "products",
            label: t("home.metrics.products"),
            value: products.length,
            icon: Boxes,
        },
        {
            key: "categories",
            label: t("home.metrics.categories"),
            value: categories.length,
            icon: Layers3,
        },
        {
            key: "visitors",
            label: t("home.metrics.visitors"),
            value: typeof visitorCount === "number" ? visitorCount : null,
            icon: Users,
        },
    ]

    return (
        <main className="container relative overflow-hidden py-8 md:py-14">
            <AnnouncementPopup popup={announcement?.popup ?? null} />

            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-[-18rem] h-[28rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.14),_transparent_62%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(96,165,250,0.18),_transparent_65%)]" />
                <div className="absolute left-[8%] top-24 h-48 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute right-[4%] top-16 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-400/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.42),_transparent_54%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_58%)]" />
                <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,rgba(15,23,42,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.12)_1px,transparent_1px)] [background-size:72px_72px] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
            </div>

            <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/40 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.75),_transparent_36%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_36%)]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="relative grid gap-6 px-6 py-7 md:px-8 md:py-8 xl:grid-cols-[minmax(0,1.25fr)_22rem] xl:items-stretch">
                    <div className="flex flex-col justify-between gap-6">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>{t("home.heroBadge")}</span>
                            </div>
                            <div className="max-w-3xl space-y-3">
                                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                                    {t("home.title")}
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                    {t("home.subtitle")}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {heroMetrics.map((metric) => {
                                const Icon = metric.icon
                                return (
                                    <div
                                        key={metric.key}
                                        className="rounded-[1.4rem] border border-border/45 bg-background/72 px-4 py-4 shadow-sm backdrop-blur-md"
                                    >
                                        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="text-2xl font-semibold tracking-tight text-foreground">
                                            {metric.value === null ? "--" : metric.value}
                                        </div>
                                        <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                            {metric.label}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="rounded-[1.7rem] border border-border/45 bg-background/76 p-5 shadow-sm backdrop-blur-xl">
                            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                <Search className="h-4 w-4" />
                                <span>{t("home.heroSearchHint")}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={t("common.searchPlaceholder")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-11 rounded-2xl border-border/50 bg-background/90 pl-10 shadow-none transition-colors focus:border-primary/50"
                                    />
                                </div>
                                <div className="rounded-[1.4rem] border border-border/45 bg-muted/25 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        <Layers3 className="h-4 w-4" />
                                        <span>{t("home.heroCategoryLead")}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {highlightedCategories.length > 0 ? (
                                            highlightedCategories.map((category) => {
                                                const categoryIcon = categoryConfig?.find((item) => item.name === category)?.icon
                                                return (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() => setSelectedCategory(category)}
                                                        className={cn(
                                                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                                                            selectedCategory === category
                                                                ? "border-primary/35 bg-primary/10 text-primary"
                                                                : "border-border/55 bg-background/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                                                        )}
                                                    >
                                                        {categoryIcon ? `${categoryIcon} ${category}` : category}
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <span className="text-sm text-muted-foreground">{t("home.noProducts")}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {wishlistEnabled && (
                                <Link href="/wishlist" className="inline-flex">
                                    <Button variant="outline" className="h-11 rounded-2xl border-border/50 bg-background/70 px-4 shadow-none">
                                        <Heart className="mr-2 h-4 w-4" />
                                        {t("wishlist.title")}
                                    </Button>
                                </Link>
                            )}
                            <div className="inline-flex flex-1 items-center justify-between rounded-2xl border border-border/45 bg-background/72 px-4 py-3 text-sm text-muted-foreground shadow-sm">
                                <span>{t("home.resultsCount", { count: sortedProducts.length })}</span>
                                <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {announcement?.banner && (
                <section className="mb-6">
                    <div className="relative overflow-hidden rounded-[1.6rem] border border-primary/15 bg-gradient-to-r from-primary/6 via-primary/10 to-cyan-200/10 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-300 dark:to-cyan-400/8">
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary/80 to-cyan-400/70" />
                        <div className="flex items-start gap-3 pl-2">
                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{announcement.banner}</p>
                        </div>
                    </div>
                </section>
            )}

            {pendingOrders && pendingOrders.length > 0 && (
                <section className="mb-8">
                    <div className="relative overflow-hidden rounded-[1.6rem] border border-yellow-500/20 bg-gradient-to-r from-yellow-500/6 via-yellow-500/10 to-amber-300/12 px-5 py-4 dark:to-amber-400/8">
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-400/70" />
                        <div className="flex items-center justify-between gap-4 pl-2">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium text-foreground/90">
                                    {pendingOrders.length === 1
                                        ? t("home.pendingOrder.single", { orderId: pendingOrders[0].orderId })
                                        : t("home.pendingOrder.multiple", { count: pendingOrders.length })}
                                </p>
                            </div>
                            <Link href={pendingOrders.length === 1 ? `/order/${pendingOrders[0].orderId}` : "/orders"}>
                                <Button size="sm" variant="outline" className="cursor-pointer rounded-full border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-400">
                                    {pendingOrders.length === 1 ? t("common.payNow") : t("common.viewOrders")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="mb-10 space-y-4">
                <div className="flex flex-col gap-4 rounded-[1.8rem] border border-border/40 bg-card/70 p-4 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.3)] backdrop-blur-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>{t("home.catalogEyebrow")}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {t("home.catalogSubtitle")}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="h-9 rounded-full border border-border/50 bg-background/80 px-4">
                                {t("home.resultsCount", { count: sortedProducts.length })}
                            </Badge>
                            {typeof visitorCount === "number" && (
                                <Badge variant="secondary" className="h-9 rounded-full border border-border/50 bg-background/80 px-4">
                                    {t("home.visitorCount", { count: visitorCount })}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] xl:items-center">
                        <div className="relative w-full">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t("common.searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 rounded-2xl border-border/50 bg-background/90 pl-10 shadow-none"
                            />
                        </div>

                        <div className="w-full overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                            <NavigationPill
                                items={[
                                    { key: "", label: t("common.all") },
                                    ...categories.map((cat) => {
                                        const categoryIcon = categoryConfig?.find((c) => c.name === cat)?.icon
                                        return {
                                            key: cat,
                                            label: categoryIcon ? `${categoryIcon} ${cat}` : cat,
                                        }
                                    }),
                                ]}
                                selectedKey={selectedCategory || ""}
                                onSelect={(key) => setSelectedCategory(key || null)}
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                            {sortOptions.map((opt) => (
                                <Button
                                    key={opt.key}
                                    type="button"
                                    variant={sortKey === opt.key ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "h-10 rounded-2xl px-4 whitespace-nowrap text-xs",
                                        sortKey === opt.key
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                    )}
                                    onClick={() => setSortKey(opt.key)}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            {t("home.catalogTitle")}
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {t("home.catalogSubtitle")}
                        </p>
                    </div>
                    <Badge variant="secondary" className="w-fit rounded-full border border-border/50 bg-background/80 px-4 py-2">
                        {t("home.resultsCount", { count: sortedProducts.length })}
                    </Badge>
                </div>

                {sortedProducts.length === 0 ? (
                    <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-border/50 bg-muted/25 px-6 py-20 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.08),_transparent_60%)] dark:bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.08),_transparent_65%)]" />
                        <div className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 shadow-sm">
                            <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="relative font-medium text-muted-foreground">{t("home.noProducts")}</p>
                        <p className="relative mt-2 text-sm text-muted-foreground/70">{t("home.checkBackLater")}</p>
                        {selectedCategory && (
                            <Button variant="link" className="relative mt-4" onClick={() => setSelectedCategory(null)}>
                                {t("common.all")}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {pageItems.map((product, index) => (
                            <Card
                                key={product.id}
                                className={cn(
                                    "group tech-card relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-border/35 bg-card/85 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.28)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
                                    product.stockCount <= 0 && "opacity-90"
                                )}
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <Link
                                    href={`/buy/${product.id}`}
                                    prefetch={false}
                                    aria-label={t("common.viewDetails")}
                                    className="absolute inset-0 z-10"
                                />
                                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_32%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.14),_transparent_36%)]" />

                                <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-[1.45rem] border border-border/30 bg-gradient-to-br from-primary/8 via-background to-secondary/45">
                                    <Image
                                        src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 2}
                                        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.1),_transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.06),_transparent_55%)]" />
                                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                                        {product.category && product.category !== "general" ? (
                                            <Badge className="h-7 rounded-full border border-border/40 bg-background/86 px-3 text-[10px] font-medium capitalize text-foreground shadow-sm">
                                                {product.category}
                                            </Badge>
                                        ) : (
                                            <span />
                                        )}
                                        <Badge
                                            className={cn(
                                                "h-7 rounded-full border px-3 text-[10px] font-medium shadow-sm",
                                                product.stockCount > 0
                                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                                    : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                            )}
                                        >
                                            {product.stockCount > 0 ? t("common.inStock") : t("common.outOfStock")}
                                        </Badge>
                                    </div>
                                    {product.isHot && (
                                        <Badge className="absolute bottom-3 left-3 h-7 rounded-full border-0 bg-orange-500 px-3 text-[10px] font-semibold text-white shadow-lg shadow-orange-500/20">
                                            🔥 {t("buy.hot")}
                                        </Badge>
                                    )}
                                </div>

                                <CardContent className="relative z-20 flex flex-1 flex-col px-5 pb-5 pt-1">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="space-y-2">
                                            <h3
                                                className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
                                                title={product.name}
                                            >
                                                {product.name}
                                            </h3>
                                            {product.reviewCount !== undefined && product.reviewCount > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <StarRatingStatic rating={Math.round(product.rating || 0)} size="xs" />
                                                    <span className="text-[11px] font-medium text-muted-foreground">
                                                        {product.reviewCount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-5 line-clamp-3 min-h-[3.9rem] text-sm leading-6 text-muted-foreground/90">
                                        {product.descriptionPlain || product.description || t("buy.noDescription")}
                                    </div>

                                    <div className="mt-auto rounded-[1.3rem] border border-border/35 bg-background/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                                        <div className="flex items-end justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="whitespace-nowrap text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                                                        {Number(product.price)}
                                                    </span>
                                                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                        {t("common.credits")}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    <span>{t("common.stock")}: {product.stockCount >= INFINITE_STOCK ? "∞" : product.stockCount}</span>
                                                    <span>{t("common.sold")}: {product.soldCount}</span>
                                                    {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                                                        <span className="line-through opacity-70">
                                                            {Number(product.compareAtPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/45 bg-background/90 text-primary shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                                                <ArrowRight className="h-4.5 w-4.5" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {sortedProducts.length > 0 && (
                <div className="mt-10 flex flex-col gap-4 rounded-[1.6rem] border border-border/40 bg-card/70 px-5 py-4 text-sm text-muted-foreground shadow-[0_16px_40px_-32px_rgba(15,23,42,0.25)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium">
                        {t("search.page", { page: currentPage, totalPages })}
                    </span>
                    {hasMore ? (
                        <Button variant="outline" size="sm" className="h-10 rounded-2xl px-4" onClick={() => setPage(currentPage + 1)}>
                            {t("common.loadMore")}
                        </Button>
                    ) : (
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                            {t("common.viewDetails")}
                        </span>
                    )}
                </div>
            )}
        </main>
    )
}
