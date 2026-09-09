import { BaseSectionProps } from "./types"

import { Section404Template, Section404TemplateProps } from "./sections/Section404Template"
import { AgeVerifierPopup, AgeVerifierPopupProps } from "./sections/AgeVerifierPopup"
import { Annoucement, AnnoucementProps } from "./sections/Annoucement"
import { Apps, AppsProps } from "./sections/Apps"
import { Article, ArticleProps } from "./sections/Article"
import { BannerWithSlider, BannerWithSliderProps } from "./sections/BannerWithSlider"
import { BlogPosts, BlogPostsProps } from "./sections/BlogPosts"
import { BlogTemplate, BlogTemplateProps } from "./sections/BlogTemplate"
import { BrandsList, BrandsListProps } from "./sections/BrandsList"
import { Breadcrumb, BreadcrumbProps } from "./sections/Breadcrumb"
import { CascadingCollection, CascadingCollectionProps } from "./sections/CascadingCollection"
import { CascadingProduct, CascadingProductProps } from "./sections/CascadingProduct"
import { CollageTabs, CollageTabsProps } from "./sections/CollageTabs"
import { CollapsibleTabs, CollapsibleTabsProps } from "./sections/CollapsibleTabs"
import { CollectionImageShowcase, CollectionImageShowcaseProps } from "./sections/CollectionImageShowcase"
import { CollectionListTemplate, CollectionListTemplateProps } from "./sections/CollectionListTemplate"
import { CollectionList, CollectionListProps } from "./sections/CollectionList"
import { CollectionPageHeader, CollectionPageHeaderProps } from "./sections/CollectionPageHeader"
import { CollectionShowcase, CollectionShowcaseProps } from "./sections/CollectionShowcase"
import { CollectionTabs, CollectionTabsProps } from "./sections/CollectionTabs"
import { ContactForm, ContactFormProps } from "./sections/ContactForm"
import { CountdownTimer, CountdownTimerProps } from "./sections/CountdownTimer"
import { CustomCode, CustomCodeProps } from "./sections/CustomCode"
import { CustomContent, CustomContentProps } from "./sections/CustomContent"
import { CustomLiquid, CustomLiquidProps } from "./sections/CustomLiquid"
import { EmptySpace, EmptySpaceProps } from "./sections/EmptySpace"
import { FavoriteProductSlider, FavoriteProductSliderProps } from "./sections/FavoriteProductSlider"
import { FeaturedCollectionBanner, FeaturedCollectionBannerProps } from "./sections/FeaturedCollectionBanner"
import { FeaturedCollection, FeaturedCollectionProps } from "./sections/FeaturedCollection"
import { FeaturedProductSlider, FeaturedProductSliderProps } from "./sections/FeaturedProductSlider"
import { FlashSale, FlashSaleProps } from "./sections/FlashSale"
import { Footer, FooterProps } from "./sections/Footer"
import { FoxkitRelatedProduct, FoxkitRelatedProductProps } from "./sections/FoxkitRelatedProduct"
import { Gallery, GalleryProps } from "./sections/Gallery"
import { Header, HeaderProps } from "./sections/Header"
import { HotspotsImage, HotspotsImageProps } from "./sections/HotspotsImage"
import { IconBox, IconBoxProps } from "./sections/IconBox"
import { ImageComparison, ImageComparisonProps } from "./sections/ImageComparison"
import { ImageWithText1, ImageWithText1Props } from "./sections/ImageWithText1"
import { ImageWithText2, ImageWithText2Props } from "./sections/ImageWithText2"
import { ImageWithText, ImageWithTextProps } from "./sections/ImageWithText"
import { Lookbook, LookbookProps } from "./sections/Lookbook"
import { MainCollectionProductGrid, MainCollectionProductGridProps } from "./sections/MainCollectionProductGrid"
import { MainProduct, MainProductProps } from "./sections/MainProduct"
import { Maps, MapsProps } from "./sections/Maps"
import { MobileStickyBar, MobileStickyBarProps } from "./sections/MobileStickyBar"
import { MultipleImageWithText, MultipleImageWithTextProps } from "./sections/MultipleImageWithText"
import { NewFeaturedProduct, NewFeaturedProductProps } from "./sections/NewFeaturedProduct"
import { Newsletter, NewsletterProps } from "./sections/Newsletter"
import { PageContact, PageContactProps } from "./sections/PageContact"
import { PageFaqs, PageFaqsProps } from "./sections/PageFaqs"
import { PageFindAStore, PageFindAStoreProps } from "./sections/PageFindAStore"
import { PageSearch, PageSearchProps } from "./sections/PageSearch"
import { PasswordTemplate, PasswordTemplateProps } from "./sections/PasswordTemplate"
import { Press, PressProps } from "./sections/Press"
import { ProductBundles, ProductBundlesProps } from "./sections/ProductBundles"
import { ProductDetailsTabs, ProductDetailsTabsProps } from "./sections/ProductDetailsTabs"
import { ProductRecommendations, ProductRecommendationsProps } from "./sections/ProductRecommendations"
import { ProductReviews, ProductReviewsProps } from "./sections/ProductReviews"
import { ProductTabs, ProductTabsProps } from "./sections/ProductTabs"
import { PromotionBanner, PromotionBannerProps } from "./sections/PromotionBanner"
import { PromotionCountdownTimer, PromotionCountdownTimerProps } from "./sections/PromotionCountdownTimer"
import { QuickOrderList, QuickOrderListProps } from "./sections/QuickOrderList"
import { RecentViewedProducts, RecentViewedProductsProps } from "./sections/RecentViewedProducts"
import { RichText, RichTextProps } from "./sections/RichText"
import { ScalingLogo, ScalingLogoProps } from "./sections/ScalingLogo"
import { ScrollingPromotion, ScrollingPromotionProps } from "./sections/ScrollingPromotion"
import { Slider, SliderProps } from "./sections/Slider"
import { Testimonials, TestimonialsProps } from "./sections/Testimonials"
import { VideoHero, VideoHeroProps } from "./sections/VideoHero"
import { Video, VideoProps } from "./sections/Video"

export type MinimogSectionType =
  | "404-template"
  | "age-verifier-popup"
  | "annoucement"
  | "apps"
  | "article"
  | "banner-with-slider"
  | "blog-posts"
  | "blog-template"
  | "brands-list"
  | "breadcrumb"
  | "cascading-collection"
  | "cascading-product"
  | "collage-tabs"
  | "collapsible-tabs"
  | "collection-image-showcase"
  | "collection-list-template"
  | "collection-list"
  | "collection-page-header"
  | "collection-showcase"
  | "collection-tabs"
  | "contact-form"
  | "countdown-timer"
  | "custom-code"
  | "custom-content"
  | "custom-liquid"
  | "empty-space"
  | "favorite-product-slider"
  | "featured-collection-banner"
  | "featured-collection"
  | "featured-product-slider"
  | "flash-sale"
  | "footer"
  | "foxkit-related-product"
  | "gallery"
  | "header"
  | "hotspots-image"
  | "icon-box"
  | "image-comparison"
  | "image-with-text-1"
  | "image-with-text-2"
  | "image-with-text"
  | "lookbook"
  | "main-collection-product-grid"
  | "main-product"
  | "maps"
  | "mobile-sticky-bar"
  | "multiple-image-with-text"
  | "new-featured-product"
  | "newsletter"
  | "page-contact"
  | "page-faqs"
  | "page-find-a-store"
  | "page-search"
  | "password-template"
  | "press"
  | "product-bundles"
  | "product-details-tabs"
  | "product-recommendations"
  | "product-reviews"
  | "product-tabs"
  | "promotion-banner"
  | "promotion-countdown-timer"
  | "quick-order-list"
  | "recent-viewed-products"
  | "rich-text"
  | "scaling-logo"
  | "scrolling-promotion"
  | "slider"
  | "testimonials"
  | "video-hero"
  | "video"

export type MinimogSectionProps =
  | Section404TemplateProps
  | AgeVerifierPopupProps
  | AnnoucementProps
  | AppsProps
  | ArticleProps
  | BannerWithSliderProps
  | BlogPostsProps
  | BlogTemplateProps
  | BrandsListProps
  | BreadcrumbProps
  | CascadingCollectionProps
  | CascadingProductProps
  | CollageTabsProps
  | CollapsibleTabsProps
  | CollectionImageShowcaseProps
  | CollectionListTemplateProps
  | CollectionListProps
  | CollectionPageHeaderProps
  | CollectionShowcaseProps
  | CollectionTabsProps
  | ContactFormProps
  | CountdownTimerProps
  | CustomCodeProps
  | CustomContentProps
  | CustomLiquidProps
  | EmptySpaceProps
  | FavoriteProductSliderProps
  | FeaturedCollectionBannerProps
  | FeaturedCollectionProps
  | FeaturedProductSliderProps
  | FlashSaleProps
  | FooterProps
  | FoxkitRelatedProductProps
  | GalleryProps
  | HeaderProps
  | HotspotsImageProps
  | IconBoxProps
  | ImageComparisonProps
  | ImageWithText1Props
  | ImageWithText2Props
  | ImageWithTextProps
  | LookbookProps
  | MainCollectionProductGridProps
  | MainProductProps
  | MapsProps
  | MobileStickyBarProps
  | MultipleImageWithTextProps
  | NewFeaturedProductProps
  | NewsletterProps
  | PageContactProps
  | PageFaqsProps
  | PageFindAStoreProps
  | PageSearchProps
  | PasswordTemplateProps
  | PressProps
  | ProductBundlesProps
  | ProductDetailsTabsProps
  | ProductRecommendationsProps
  | ProductReviewsProps
  | ProductTabsProps
  | PromotionBannerProps
  | PromotionCountdownTimerProps
  | QuickOrderListProps
  | RecentViewedProductsProps
  | RichTextProps
  | ScalingLogoProps
  | ScrollingPromotionProps
  | SliderProps
  | TestimonialsProps
  | VideoHeroProps
  | VideoProps

export const minimogRegistry: Record<MinimogSectionType, (props: any) => JSX.Element> = {
  "404-template": Section404Template,
  "age-verifier-popup": AgeVerifierPopup,
  "annoucement": Annoucement,
  "apps": Apps,
  "article": Article,
  "banner-with-slider": BannerWithSlider,
  "blog-posts": BlogPosts,
  "blog-template": BlogTemplate,
  "brands-list": BrandsList,
  "breadcrumb": Breadcrumb,
  "cascading-collection": CascadingCollection,
  "cascading-product": CascadingProduct,
  "collage-tabs": CollageTabs,
  "collapsible-tabs": CollapsibleTabs,
  "collection-image-showcase": CollectionImageShowcase,
  "collection-list-template": CollectionListTemplate,
  "collection-list": CollectionList,
  "collection-page-header": CollectionPageHeader,
  "collection-showcase": CollectionShowcase,
  "collection-tabs": CollectionTabs,
  "contact-form": ContactForm,
  "countdown-timer": CountdownTimer,
  "custom-code": CustomCode,
  "custom-content": CustomContent,
  "custom-liquid": CustomLiquid,
  "empty-space": EmptySpace,
  "favorite-product-slider": FavoriteProductSlider,
  "featured-collection-banner": FeaturedCollectionBanner,
  "featured-collection": FeaturedCollection,
  "featured-product-slider": FeaturedProductSlider,
  "flash-sale": FlashSale,
  "footer": Footer,
  "foxkit-related-product": FoxkitRelatedProduct,
  "gallery": Gallery,
  "header": Header,
  "hotspots-image": HotspotsImage,
  "icon-box": IconBox,
  "image-comparison": ImageComparison,
  "image-with-text-1": ImageWithText1,
  "image-with-text-2": ImageWithText2,
  "image-with-text": ImageWithText,
  "lookbook": Lookbook,
  "main-collection-product-grid": MainCollectionProductGrid,
  "main-product": MainProduct,
  "maps": Maps,
  "mobile-sticky-bar": MobileStickyBar,
  "multiple-image-with-text": MultipleImageWithText,
  "new-featured-product": NewFeaturedProduct,
  "newsletter": Newsletter,
  "page-contact": PageContact,
  "page-faqs": PageFaqs,
  "page-find-a-store": PageFindAStore,
  "page-search": PageSearch,
  "password-template": PasswordTemplate,
  "press": Press,
  "product-bundles": ProductBundles,
  "product-details-tabs": ProductDetailsTabs,
  "product-recommendations": ProductRecommendations,
  "product-reviews": ProductReviews,
  "product-tabs": ProductTabs,
  "promotion-banner": PromotionBanner,
  "promotion-countdown-timer": PromotionCountdownTimer,
  "quick-order-list": QuickOrderList,
  "recent-viewed-products": RecentViewedProducts,
  "rich-text": RichText,
  "scaling-logo": ScalingLogo,
  "scrolling-promotion": ScrollingPromotion,
  "slider": Slider,
  "testimonials": Testimonials,
  "video-hero": VideoHero,
  "video": Video,
}

export * from "./types"
export { Section404Template } from "./sections/Section404Template"
export { AgeVerifierPopup } from "./sections/AgeVerifierPopup"
export { Annoucement } from "./sections/Annoucement"
export { Apps } from "./sections/Apps"
export { Article } from "./sections/Article"
export { BannerWithSlider } from "./sections/BannerWithSlider"
export { BlogPosts } from "./sections/BlogPosts"
export { BlogTemplate } from "./sections/BlogTemplate"
export { BrandsList } from "./sections/BrandsList"
export { Breadcrumb } from "./sections/Breadcrumb"
export { CascadingCollection } from "./sections/CascadingCollection"
export { CascadingProduct } from "./sections/CascadingProduct"
export { CollageTabs } from "./sections/CollageTabs"
export { CollapsibleTabs } from "./sections/CollapsibleTabs"
export { CollectionImageShowcase } from "./sections/CollectionImageShowcase"
export { CollectionListTemplate } from "./sections/CollectionListTemplate"
export { CollectionList } from "./sections/CollectionList"
export { CollectionPageHeader } from "./sections/CollectionPageHeader"
export { CollectionShowcase } from "./sections/CollectionShowcase"
export { CollectionTabs } from "./sections/CollectionTabs"
export { ContactForm } from "./sections/ContactForm"
export { CountdownTimer } from "./sections/CountdownTimer"
export { CustomCode } from "./sections/CustomCode"
export { CustomContent } from "./sections/CustomContent"
export { CustomLiquid } from "./sections/CustomLiquid"
export { EmptySpace } from "./sections/EmptySpace"
export { FavoriteProductSlider } from "./sections/FavoriteProductSlider"
export { FeaturedCollectionBanner } from "./sections/FeaturedCollectionBanner"
export { FeaturedCollection } from "./sections/FeaturedCollection"
export { FeaturedProductSlider } from "./sections/FeaturedProductSlider"
export { FlashSale } from "./sections/FlashSale"
export { Footer } from "./sections/Footer"
export { FoxkitRelatedProduct } from "./sections/FoxkitRelatedProduct"
export { Gallery } from "./sections/Gallery"
export { Header } from "./sections/Header"
export { HotspotsImage } from "./sections/HotspotsImage"
export { IconBox } from "./sections/IconBox"
export { ImageComparison } from "./sections/ImageComparison"
export { ImageWithText1 } from "./sections/ImageWithText1"
export { ImageWithText2 } from "./sections/ImageWithText2"
export { ImageWithText } from "./sections/ImageWithText"
export { Lookbook } from "./sections/Lookbook"
export { MainCollectionProductGrid } from "./sections/MainCollectionProductGrid"
export { MainProduct } from "./sections/MainProduct"
export { Maps } from "./sections/Maps"
export { MobileStickyBar } from "./sections/MobileStickyBar"
export { MultipleImageWithText } from "./sections/MultipleImageWithText"
export { NewFeaturedProduct } from "./sections/NewFeaturedProduct"
export { Newsletter } from "./sections/Newsletter"
export { PageContact } from "./sections/PageContact"
export { PageFaqs } from "./sections/PageFaqs"
export { PageFindAStore } from "./sections/PageFindAStore"
export { PageSearch } from "./sections/PageSearch"
export { PasswordTemplate } from "./sections/PasswordTemplate"
export { Press } from "./sections/Press"
export { ProductBundles } from "./sections/ProductBundles"
export { ProductDetailsTabs } from "./sections/ProductDetailsTabs"
export { ProductRecommendations } from "./sections/ProductRecommendations"
export { ProductReviews } from "./sections/ProductReviews"
export { ProductTabs } from "./sections/ProductTabs"
export { PromotionBanner } from "./sections/PromotionBanner"
export { PromotionCountdownTimer } from "./sections/PromotionCountdownTimer"
export { QuickOrderList } from "./sections/QuickOrderList"
export { RecentViewedProducts } from "./sections/RecentViewedProducts"
export { RichText } from "./sections/RichText"
export { ScalingLogo } from "./sections/ScalingLogo"
export { ScrollingPromotion } from "./sections/ScrollingPromotion"
export { Slider } from "./sections/Slider"
export { Testimonials } from "./sections/Testimonials"
export { VideoHero } from "./sections/VideoHero"
export { Video } from "./sections/Video"