# React + Textual Specification — Minimog Shopify Theme

## Theme identity
- **name** : `theme_info`
- **theme_name** : `Minimog - OS 2.0`
- **theme_version** : `5.7.0`
- **theme_author** : `FoxEcom`
- **theme_documentation_url** : `https://docs.foxecom.com/minimog-theme/`
- **theme_support_url** : `https://foxecom.com`

## Global settings (settings_schema)
### General settings

### Favicon

- **use_favicon** (`checkbox`) — Use favicon icon (32px x 32px) `[default: True]`
- **favicon** (`image_picker`) — Image favicon (Will be scaled down to 32 x 32px)

### Ajax "ADD TO CART"

- **use_ajax_atc** (`checkbox`) — Enable ajax "ADD TO CART" `[default: True]`

### Scroll to top button

- **show_scroll_top_button** (`checkbox`) — Show scroll to top button ([Read How-to](https://foxecom.link/9pNg7s)) `[default: True]`

### Right-to-Left support

- **enable_rtl** (`checkbox`) — Enable RTL ([Read How-to](https://foxecom.link/VGBAc3)) `[default: False]`
- **language_support_rtl** (`text`) — Languages support RTL (Enter ISO language code, separate by comma. Leave blank to enable for all languages. [Check ISO language code](https://www.loc.gov/standards/iso639-2/php/code_list.php)) `[default: he,ar]`

### Layout settings

### Fixed width container

- **container_width** (`range`) — Container width `[default: 1280]`

### Fluid container

- **container_fluid_width** (`range`) — Container max-width `[default: 1620]`
- **container_fluid_offset** (`range`) — Margin left & right `[default: 95]`

### Typography
- **paragraph** (`paragraph`)

### BODY TEXT

- **type_base_font** (`font_picker`) — Font `[default: helvetica_n4]`
- **use_custom_font_body** (`checkbox`) — Use custom font `[default: False]`

### Custom font for Body text

- **custom_body_font** (`textarea`) — Font URL (Format: Link_to_font@font_weight)
- **custom_body_weight** (`select`) — Default font weight `[default: 400]`
- **type_base_size** (`range`) — Base size `[default: 16]`
- **type_base_line_height** (`range`) — Line height `[default: 28]`

### HEADINGS

- **type_header_font** (`font_picker`) — Font `[default: helvetica_n7]`
- **use_custom_font_heading** (`checkbox`) — Use custom font `[default: False]`

### Custom font for Headings

- **paragraph** (`paragraph`)
- **custom_heading_font** (`textarea`) — Font file URLS (Format: Link_to_font@font_weight)
- **custom_heading_weight** (`select`) — Default font weight `[default: 400]`
- **h1_font_size** (`range`) — H1 font size `[default: 60]`
- **h2_font_size** (`range`) — H2 font size `[default: 42]`
- **type_header_base_size** (`range`) — H3 font size `[default: 36]`
- **h4_font_size** (`range`) — H4 font size `[default: 24]`
- **type_header_spacing** (`range`) — Letter spacing `[default: 0]`

### BUTTONS

- **paragraph** (`paragraph`)
- **btn_uppercase_text** (`checkbox`) — Uppercase text label `[default: False]`
- **btn_base_size** (`range`) — Font size `[default: 16]`
- **btn_letter_spacing** (`range`) — Letter spacing `[default: 0]`
- **btn_border_width** (`range`) — Border width `[default: 1]`
- **btn_border_radius** (`range`) — Border radius `[default: 5]`
- **btn_line_height** (`range`) — Line height `[default: 23]`
- **btn_weight** (`select`) — Font weight `[default: 500]`

### INPUTS

- **inputs_border_thickness** (`range`) — Thickness `[default: 1]`
- **inputs_border_radius** (`range`) — Corner radius `[default: 5]`

### Corner radius

- **blocks_corner_radius** (`select`) — Blocks `[default: square]`
- **pcard_corner_radius** (`select`) — Product card `[default: square]`

### Colors
- **paragraph** (`paragraph`)
- **color_schemes** (`color_scheme_group`)
- **default_color_scheme** (`color_scheme`) — Body color scheme `[default: default]`

### Count bubble

- **paragraph** (`paragraph`)
- **bg_cart_wishlist_count** (`color`) — Background `[default: #da3f3f]`
- **color_cart_wishlist_count** (`color`) — Text `[default: #ffffff]`

### Notification

- **color_success** (`color`) — Success `[default: #3a8735]`
- **color_warning** (`color`) — Warning `[default: #D2861A]`
- **color_error** (`color`) — Error `[default: #da3f3f]`

### Overlay

- **img_overlay_bg** (`color`) — Background `[default: #000000]`
- **img_overlay_opacity** (`range`) — Opacity `[default: 40]`

### Section

### Spacing

- **spacing_sections** (`range`) — Space between sections `[default: 100]`
- **spacing_sections_mobile** (`range`) — Space between sections on mobile `[default: 48]`

### Animations
- **page_transition** (`checkbox`) — Enable page transition `[default: True]`
- **loading_design_mode** (`checkbox`) — Design mode (In "Design Mode", the page transition process is always displayed regardless of the relevant settings or removal so you can review it all the time. When satisfied with the interface, turn it off)
- **loading_size** (`range`) — Loading size `[default: 80]`
- **loading_color** (`color`) — Loading color `[default: #bbbbbb]`
- **loading_logo** (`image_picker`) — Custom logo ( Should use square sized images. Example: 64x64, 128x128)

### Visible in the view

- **animations** (`select`) — Animation `[default: none]`
- **animation_duration** (`range`) — Duration `[default: 0.6]`

### Product card
- **paragraph** (`paragraph`)

### Layout

- **pcard_layout** (`select`) — Card style `[default: 1]`
- **pcard_alignment** (`select`) — Content alignment `[default: left]`

### Image

- **pcard_image_ratio** (`select`) — Aspect ratio `[default: original]`
- **pcard_show_video** (`checkbox`) — Show video as featured image (Video must be first in media list and hosted on Shopify.) `[default: False]`
- **show_second_img** (`checkbox`) — Show second image on hover `[default: True]`
- **pcard_default_image** (`image_picker`) — Default thumbnail (For products without images)

### Variant options

- **show_swatch_option** (`checkbox`) — Show variant options (Product card is limited to showing only 1 option) `[default: True]`
- **pcard_keep_featured_image** (`checkbox`) — Show featured image (If uncheck, image of variant selected will be show) `[default: True]`
- **pcard_option_name** (`text`) — Option name (Example: Color, Size, Material...) `[default: Color]`
- **pcard_option_design** (`select`) — Option design `[default: color]`
- **pcard_limit_values_number** (`range`) — Number of option's values to display (Set to 0 to display all option's values) `[default: 4]`

### Content

- **show_cart_button** (`checkbox`) — Show Add To Cart button `[default: True]`
- **show_quickview_button** (`checkbox`) — Show Quickview button `[default: True]`
- **show_wishlist_button** (`checkbox`) — Show Wishlist button `[default: True]`
- **show_compare_button** (`checkbox`) — Show Compare button `[default: True]`
- **show_countdown** (`checkbox`) — Show countdown `[default: False]`
- **pcard_show_inventory** (`checkbox`) — Show product inventory (Navigate to "Theme Settings > Product Inventory" for settings.) `[default: False]`
- **select_option_button_action** (`select`) — When click Select options button `[default: popup]`

### Badges

- **on_sale_badge** (`select`) — Sale badge `[default: hide]`
- **show_badge_soldout** (`checkbox`) — Show sold out badge `[default: True]`
- **show_review_badge** (`checkbox`) — Show reviews badge `[default: False]`
- **show_badge_sale** (`checkbox`) — Show custom tag badges (How to set up custom product tags? [Read How-to](https://foxecom.link/VafwzY).) `[default: False]`

### Product title

- **show_vendor** (`checkbox`) — Show vendor `[default: False]`
- **uppercase_prd_name** (`checkbox`) — Capitalize product name `[default: False]`
- **pcard_title_line_clamp** (`select`) — Product title line limit `[default: unset]`

### Product prices

- **pcard_show_lowest_prices** (`checkbox`) — Show lowest prices `[default: False]`

### Collection card
- **collection_card_color_scheme** (`color_scheme`) — Color scheme `[default: default]`

### Article card
- **article_image_aspect_ratio** (`select`) — Image aspect ratio `[default: 16/9]`
- **article_align_content** (`select`) — Content alignment `[default: text-left]`
- **article_show_tags** (`checkbox`) — Show tags `[default: True]`
- **article_show_date** (`checkbox`) — Show publised date `[default: True]`
- **article_show_excerpt** (`checkbox`) — Show excerpt `[default: True]`
- **article_show_button** (`checkbox`) — Show read more link `[default: True]`

### Product options design
- **paragraph** (`paragraph`)
- **paragraph** (`paragraph`)

### Default option design

- **variant_option_design_default** (`select`) — Design (Default design if option's name doesn't match any of the 5 names in the below settings) `[default: button]`

### Option 1

- **variant_option_title1** (`text`) — Name `[default: Size]`
- **variant_option_design1** (`select`) — Design `[default: button]`
- **variant_option_display_name1** (`text`) — Alternative name (Example: Select a size)

### Option 2

- **variant_option_title2** (`text`) — Name `[default: Color]`
- **variant_option_design2** (`select`) — Design `[default: color]`
- **variant_option_display_name2** (`text`) — Alternative name (Example: Select a color)

### Option 3

- **variant_option_title3** (`text`) — Name `[default: Material]`
- **variant_option_design3** (`select`) — Design `[default: dropdown]`
- **variant_option_display_name3** (`text`) — Alternative name (Example: Select a material)

### Option 4

- **variant_option_title4** (`text`) — Name `[default: Brand]`
- **variant_option_design4** (`select`) — Design `[default: dropdown]`
- **variant_option_display_name4** (`text`) — Alternative name (Example: Select a brand)

### Option 5

- **variant_option_title5** (`text`) — Name `[default: Type]`
- **variant_option_design5** (`select`) — Design `[default: default]`
- **variant_option_display_name5** (`text`) — Alternative name (Example: Select a type)

### Product options swatches
- **paragraph** (`paragraph`)

### Colors palette

- **product_colors** (`textarea`) — Custom colors (Use Hex color code, see more [Hex color](https://www.color-hex.com/)) `[default: red: #ff0000,
yellow: #ffff00,
black: #000000,
blue: #0000FF,
green: #00ff00,
purple: #800080,
silver: #c0c0c0,
white: #ffffff,
brown: #7B3F00,
light-brown: #feb035,
dark-turquoise: #23cddc,
orange: #fe9001,
tan: #eacea7,
violet: #EE82EE,
pink: #FFC0CB,
grey: #808080]`

### Custom images

- **filter_color1** (`text`) — Option value 1
- **filter_color1.png** (`image`) — Custom image for value 1
- **filter_color2** (`text`) — Option value 2
- **filter_color2.png** (`image`) — Custom image for value 2
- **filter_color3** (`text`) — Option value 3
- **filter_color3.png** (`image`) — Custom image for value 3
- **filter_color4** (`text`) — Option value 4
- **filter_color4.png** (`image`) — Custom image for value 4
- **filter_color5** (`text`) — Option value 5
- **filter_color5.png** (`image`) — Custom image for value 5
- **filter_color6** (`text`) — Option value 6
- **filter_color6.png** (`image`) — Custom image for value 6
- **filter_color7** (`text`) — Option value 7
- **filter_color7.png** (`image`) — Custom image for value 7
- **filter_color8** (`text`) — Option value 8
- **filter_color8.png** (`image`) — Custom image for value 8
- **filter_color9** (`text`) — Option value 9
- **filter_color9.png** (`image`) — Custom image for value 9
- **filter_color10** (`text`) — Option value 10
- **filter_color10.png** (`image`) — Custom image for value10
- **filter_color11** (`text`) — Option value 11
- **filter_color11.png** (`image`) — Custom image for value11
- **filter_color12** (`text`) — Option value 12
- **filter_color12.png** (`image`) — Custom image for value12
- **filter_color13** (`text`) — Option value 13
- **filter_color13.png** (`image`) — Custom image for value13
- **filter_color14** (`text`) — Option value 14
- **filter_color14.png** (`image`) — Custom image for value14
- **filter_color15** (`text`) — Option value 15
- **filter_color15.png** (`image`) — Custom image for value15
- **filter_color16** (`text`) — Option value 16
- **filter_color16.png** (`image`) — Custom image for value16
- **filter_color17** (`text`) — Option value 17
- **filter_color17.png** (`image`) — Custom image for value17
- **filter_color18** (`text`) — Option value 18
- **filter_color18.png** (`image`) — Custom image for value18
- **filter_color19** (`text`) — Option value 19
- **filter_color19.png** (`image`) — Custom image for value19
- **filter_color20** (`text`) — Option value 20
- **filter_color20.png** (`image`) — Custom image for value20
- **filter_color21** (`text`) — Option value 21
- **filter_color21.png** (`image`) — Custom image for value21
- **filter_color22** (`text`) — Option value 22
- **filter_color22.png** (`image`) — Custom image for value22
- **filter_color23** (`text`) — Option value 23
- **filter_color23.png** (`image`) — Custom image for value23
- **filter_color24** (`text`) — Option value 24
- **filter_color24.png** (`image`) — Custom image for value24
- **filter_color25** (`text`) — Option value 25
- **filter_color25.png** (`image`) — Custom image for value25
- **filter_color26** (`text`) — Option value 26
- **filter_color26.png** (`image`) — Custom image for value26
- **filter_color27** (`text`) — Option value 27
- **filter_color27.png** (`image`) — Custom image for value27
- **filter_color28** (`text`) — Option value 28
- **filter_color28.png** (`image`) — Custom image for value28
- **filter_color29** (`text`) — Option value 29
- **filter_color29.png** (`image`) — Custom image for value29
- **filter_color30** (`text`) — Option value 30
- **filter_color30.png** (`image`) — Custom image for value30
- **filter_color31** (`text`) — Option value 31
- **filter_color31.png** (`image`) — Custom image for value31
- **filter_color32** (`text`) — Option value 32
- **filter_color32.png** (`image`) — Custom image for value32
- **filter_color33** (`text`) — Option value 33
- **filter_color33.png** (`image`) — Custom image for value33
- **filter_color34** (`text`) — Option value 34
- **filter_color34.png** (`image`) — Custom image for value34
- **filter_color35** (`text`) — Option value 35
- **filter_color35.png** (`image`) — Custom image for value35
- **filter_color36** (`text`) — Option value 36
- **filter_color36.png** (`image`) — Custom image for value36
- **filter_color37** (`text`) — Option value 37
- **filter_color37.png** (`image`) — Custom image for value37
- **filter_color38** (`text`) — Option value 38
- **filter_color38.png** (`image`) — Custom image for value38
- **filter_color39** (`text`) — Option value 39
- **filter_color39.png** (`image`) — Custom image for value39
- **filter_color40** (`text`) — Option value 40
- **filter_color40.png** (`image`) — Custom image for value40
- **filter_color41** (`text`) — Option value 41
- **filter_color41.png** (`image`) — Custom image for value41
- **filter_color42** (`text`) — Option value 42
- **filter_color42.png** (`image`) — Custom image for value42
- **filter_color43** (`text`) — Option value 43
- **filter_color43.png** (`image`) — Custom image for value43
- **filter_color44** (`text`) — Option value 44
- **filter_color44.png** (`image`) — Custom image for value44
- **filter_color45** (`text`) — Option value 45
- **filter_color45.png** (`image`) — Custom image for value45
- **filter_color46** (`text`) — Option value 46
- **filter_color46.png** (`image`) — Custom image for value46
- **filter_color47** (`text`) — Option value 47
- **filter_color47.png** (`image`) — Custom image for value47
- **filter_color48** (`text`) — Option value 48
- **filter_color48.png** (`image`) — Custom image for value48
- **filter_color49** (`text`) — Option value 49
- **filter_color49.png** (`image`) — Custom image for value49
- **filter_color50** (`text`) — Option value 50
- **filter_color50.png** (`image`) — Custom image for value50

### Product inventory
- **low_inventory_threshold** (`range`) — Low inventory threshold (When inventory levels are equal to or below this number, it is considered 'Low') `[default: 20]`
- **inventory_visibility** (`select`) — Show inventory notice `[default: always]`
- **inventory_hide_backordered** (`checkbox`) — Hide backordered inventory notice `[default: False]`
- **show_inventory_count** (`select`) — Show inventory count `[default: always]`

### Drawer & popup
- **drawer_popup_color_scheme** (`color_scheme`) — Color scheme

### Badges
- **hot_badge_color_scheme** (`color_scheme`) — Hot badge color scheme `[default: badge-hot]`
- **new_badge_color_scheme** (`color_scheme`) — New badge color scheme `[default: badge-new]`
- **sale_badge_color_scheme** (`color_scheme`) — Sale badge color scheme `[default: badge-sale]`
- **preorder_badge_color_scheme** (`color_scheme`) — Preorder badge color scheme `[default: dark]`
- **soldout_badge_color_scheme** (`color_scheme`) — Sold out badge color scheme `[default: footer]`

### Social sharing
- **social_sharing_blog** (`checkbox`) — Enable sharing for blog articles `[default: True]`
- **share_facebook** (`checkbox`) — Share on Facebook `[default: True]`
- **share_twitter** (`checkbox`) — Tweet on Twitter `[default: True]`
- **share_pinterest** (`checkbox`) — Pin on Pinterest `[default: True]`

### Store contact
- **paragraph** (`paragraph`)
- **contact_phone_number** (`text`) — Phone number `[default: +84 (0)387 392 056]`
- **contact_email** (`text`) — Email `[default: hello@domain.com]`
- **find_store** (`page`) — Find store page

### Social links

- **social_twitter_link** (`text`) — Twitter link
- **social_twitter_label** (`text`) — Twitter label
- **social_facebook_link** (`text`) — Facebook link
- **social_facebook_label** (`text`) — Facebook label
- **social_pinterest_link** (`text`) — Pinterest link
- **social_pinterest_label** (`text`) — Pinterest label
- **social_instagram_link** (`text`) — Instagram link
- **social_instagram_label** (`text`) — Instagram label
- **social_snapchat_link** (`text`) — Snapchat link
- **social_snapchat_label** (`text`) — Snapchat label
- **social_tumblr_link** (`text`) — Tumblr link
- **social_tumblr_label** (`text`) — Tumblr label
- **social_youtube_link** (`text`) — Youtube link
- **social_youtube_label** (`text`) — Youtube label
- **social_vimeo_link** (`text`) — Vimeo link
- **social_vimeo_label** (`text`) — Vimeo label
- **social_tiktok_link** (`text`) — Tiktok link
- **social_tiktok_label** (`text`) — Tiktok label
- **social_discord_link** (`text`) — Discord link
- **social_discord_label** (`text`) — Discord label
- **social_whatsapp_link** (`text`) — Whatsapp link
- **social_whatsapp_label** (`text`) — Whatsapp label
- **social_spotify_link** (`text`) — Spotify link
- **social_spotify_label** (`text`) — Spotify label
- **social_linkedin_link** (`text`) — Linkedin link
- **social_linkedin_label** (`text`) — Linkedin label
- **social_line_link** (`text`) — Line link
- **social_line_label** (`text`) — Line label

### Cart settings
- **paragraph** (`paragraph`)

### Cart drawer

- **enable_cart_drawer** (`checkbox`) — Enable cart drawer `[default: True]`
- **cart_drawer_show_accelerated_button** (`checkbox`) — Show accelerated checkout `[default: False]`

### Cart addons

- **cart_notes_enable** (`checkbox`) — Show cart note `[default: True]`
- **discount_code_enable** (`checkbox`) — Show discount code `[default: False]`
- **cart_estimate_shipping** (`checkbox`) — Show estimate shipping rates `[default: True]`
- **show_delivery_days** (`checkbox`) — Show delivery days for estimate shipping `[default: False]`
- **delivery_time_enable** (`checkbox`) — Show delivery time `[default: False]`
- **default_country_estimate_shipping** (`text`) — Default country for estimate shipping (Default country for estimate shipping rates form. Enter country name, for example: United States. Refer to the country name [here](https://zest-docs.foxecom.com/theme-settings/cart#3.-country-code)) `[default: United States]`
- **cart_drawer_trust_badge** (`image_picker`) — Trust badge

### Search
- **enable_predictive_search** (`checkbox`) — Enable predictive search (Enable predictive search so that suggested results appear immediately as you type into the search field. [Learn more](https://shopify.dev/themes/navigation-search/search/predictive-search)) `[default: True]`
- **search_by_tag** (`checkbox`) — Search by product's tags `[default: False]`
- **search_by_body** (`checkbox`) — Search by product's description `[default: False]`
- **paragraph** (`paragraph`)
- **popular_search_queries** (`textarea`) — Popular searches (Separate by ",") `[default: T-Shirt, Blue, Jacket]`
- **search_unavailable_products** (`select`) — Results for unavailable products `[default: last]`

### Additional pages
- **paragraph** (`paragraph`)
- **wishlist_page** (`page`) — Wishlist page
- **product_compare_page** (`page`) — Product comparison

### GDPR settings
- **paragraph** (`paragraph`)

### Terms & conditions checkbox

- **agree_text** (`richtext`) — Text `[default: <p>I agree with the <a href="#" title="#">Terms & conditions</a></p>]`
- **show_agree_on_cart** (`checkbox`) — Show on cart page & cart drawer `[default: False]`
- **show_agree_on_product** (`checkbox`) — Show on product page `[default: False]`
- **show_agree_on_register** (`checkbox`) — Show on register page `[default: False]`

### Cookie consent

- **show_cookie_consent** (`checkbox`) — Show cookie consent `[default: False]`
- **cookie_design_mode** (`checkbox`) — Design mode `[default: True]`
- **cookie_consent_message** (`textarea`) — Message `[default: This website uses cookies to ensure you get the best experience on our website.]`
- **cookie_consent_allow** (`text`) — Allow button `[default: Allow cookies]`
- **cookie_consent_decline** (`text`) — Decline button (Leave blank to hide) `[default: Decline]`
- **cookie_consent_learnmore** (`text`) — Learn more text `[default: Learn more]`
- **cookie_consent_learnmore_link** (`text`) — Learn more link (Leave blank to hide) `[default: https://www.cookiesandyou.com/]`

### Design

- **cookie_consent_placement** (`select`) — Placement `[default: bottom]`
- **cookie_consent_theme** (`select`) — Theme `[default: black]`

### Integration

### Google map API

- **gm_api** (`text`) — API Key ([Read How-to](https://help.shopify.com/en/manual/online-store/themes/themes-by-shopify/vintage-themes/customizing-vintage-themes/map-section-api-key))

### Advanced
- **custom_css** (`html`) — Custom CSS ([Read How-to](https://foxecom.link/MheFBS))

### Integrated apps
- **paragraph** (`paragraph`)

### Product reviews

- **review_app** (`select`) — Product reviews app (Select your preferred app. If you are using another app, please put the snippet code of the app to file: snippets/other-review-app-snippet.liquid or contact us for help.) `[default: shopify]`

### Wishlist

- **wishlist_app** (`select`) — Wishlist app (Select your preferred app) `[default: theme]`

### Currency format

### Currency codes

- **paragraph** (`paragraph`)
- **currency_code_enabled** (`checkbox`) — Show currency codes `[default: False]`

## Sections
Total sections : 2

### Footer
- Fichier : `sections/footer-group.json`

### Header
- Fichier : `sections/header-group.json`

## Templates
Total templates : 47

### 404
- Sections (ordre) :
  1. `404-template` (id=main, settings=['bg_color', 't1_color', 't2_color'])
  1. `custom-liquid` (id=custom_liquid_cx7zDH, settings=['custom_liquid', 'custom_class'])

### article
- Sections (ordre) :
  1. `article` (id=main, settings=['container', 'sidebar_show', 'sidebar_position', 'design', 'blog_show_author', 'blog_show_date', 'blog_show_tags', 'blog_show_social', 'blog_show_comment', 'show_related_articles', 'article_align_content', 'article_show_tags', 'article_show_date', 'article_show_excerpt', 'article_show_button'])

### blog
- Sections (ordre) :
  1. `blog-template` (id=main, settings=['container', 'show_sidebar', 'layout', 'view', 'blog_list', 'show_item_per_row'])

### cart
- Sections (ordre) :
  1. `cart-template` (id=main, settings=[])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=[])

### collection.canvas-sidebar
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.custom-content-banner
- Sections (ordre) :
  1. `collection-list` (id=collection_list_aVhnwB, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'layout', 'expanded', 'card_style', 'text_alignment', 'hover_effect', 'show_product_count', 'count_inline_title', 'image_rounded', 'items_per_row', 'item_gap', 'enable_slider', 'show_pagination', 'show_navigation', 'autorotate', 'autorotate_speed', 'mobile_disable_slider', 'use_scroll_mobile', 'mobile_gap', 'hidden_slide_control_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `empty-space` (id=empty_space_aG8DFL, settings=['container', 'color_scheme', 'show_divider_line', 'divider_style', 'divider_height', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.filter-by-tags
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.filter-left-sidebar
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.filter-right-sidebar
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.flash-sale
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['layout', 'enable_parallax', 'text_alignment', 'upper_title', 'show_desc', 'collection_all_desc'])
  1. `flash-sale` (id=flash-sale, settings=[])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'heading', 'columns', 'column_gap', 'enable_slider'])

### collection.full-width
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.grid-2-columns
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.grid-3-columns
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.grid-4-columns
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.grid-5-columns
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.hidden-sidebar
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.infinite-scroll
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.load-more-button
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### collection.view-list
- Sections (ordre) :
  1. `collection-page-header` (id=collection-header, settings=['color_scheme', 'container', 'layout', 'image_position', 'enable_parallax', 'parallax_direction', 'text_alignment', 'text_color', 'upper_title', 'show_desc', 'collection_all_desc', 'padding_top', 'padding_bottom', 'enable_bg_zoom_effect'])
  1. `main-collection-product-grid` (id=main, settings=['container', 'grid_layout', 'grid_columns', 'show_columns_switcher', 'pagination_limit', 'paginate_type', 'show_sorting', 'show_filter', 'filters_type', 'sidebar', 'sidebar_title', 'limit_height_widget', 'limit_height', 'change_product_variant_on_fitlering', 'show_product_count', 'collapsed_groups', 'color_swatches', 'color_swatches_design'])
  1. `recent-viewed-products` (id=recent-viewed, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### account
- Sections (ordre) :
  1. `main-account` (id=main, settings=[])

### activate_account
- Sections (ordre) :
  1. `main-activate-account` (id=main, settings=[])

### addresses
- Sections (ordre) :
  1. `main-addresses` (id=main, settings=[])

### login
- Sections (ordre) :
  1. `main-login` (id=main, settings=[])

### order
- Sections (ordre) :
  1. `main-order` (id=main, settings=[])

### register
- Sections (ordre) :
  1. `main-register` (id=main, settings=[])

### reset_password
- Sections (ordre) :
  1. `main-reset-password` (id=main, settings=[])

### index
- Sections (ordre) :
  1. `slider` (id=1621243260e1af0c20, settings=['container', 'slideshow_height', 'show_overlay', 'dots_position', 'dots_color', 'show_dots', 'show_arrows', 'autorotate', 'autorotate_speed', 'use_content_above', 'custom_class', 'animations'])
  1. `scrolling-promotion` (id=scrolling_promotion_jjrFyf, settings=['container', 'direction', 'speed', 'item_gap', 'item_gap_mobile', 'color_scheme', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `collection-list` (id=16225316461d1cff80, settings=['heading', 'heading_size', 'subheading', 'description', 'button_label', 'button_link', 'button_style', 'header_alignment', 'color_scheme', 'container', 'layout', 'expanded', 'card_style', 'text_alignment', 'hover_effect', 'show_product_count', 'count_inline_title', 'image_rounded', 'items_per_row', 'item_gap', 'enable_slider', 'show_pagination', 'show_navigation', 'autorotate', 'autorotate_speed', 'mobile_disable_slider', 'use_scroll_mobile', 'mobile_gap', 'hidden_slide_control_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `video` (id=video_UBDVGh, settings=['container', 'color_scheme', 'video_type', 'video_link', 'ratio', 'video_title', 'text_size', 'text_color', 'play_style', 'play_size', 'width', 'autoplay', 'loop', 'muted', 'show_controls', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `featured-collection` (id=featured_collection_JMKRYa, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `featured-collection` (id=featured_collection_cMiPaY, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `featured-collection` (id=featured_collection_kepWEE, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `product-tabs` (id=162251092958fcda7c, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'tab_header', 'limit', 'show_button', 'button_type', 'button_label', 'button_style', 'button_size', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'items_per_row', 'item_gap', 'enable_slider', 'show_navigation', 'show_pagination', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `icon-box` (id=16225125199f82d8fe, settings=['container', 'color_scheme', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'item_per_row', 'item_gap', 'item_gap_mobile', 'card_style', 'image_max_width', 'content_alignment', 'hover_effect', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'use_grid_column_mb', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `product-tabs` (id=product_tabs_wdkKzU, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'tab_header', 'limit', 'show_button', 'button_type', 'button_label', 'button_style', 'button_size', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'items_per_row', 'item_gap', 'enable_slider', 'show_navigation', 'show_pagination', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=custom_content_hh6hmV, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `custom-content` (id=7ea56e8d-5794-4708-8812-8ee9604a3a21, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `custom-content` (id=custom_content_KiFzqG, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `custom-content` (id=custom_content_xALaMf, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `featured-collection` (id=featured_collection_jaQfkJ, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `featured-collection` (id=featured_collection_3x6L3j, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `testimonials` (id=testimonials_pnyUnX, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'design', 'show_stars', 'autorotate', 'show_navigation', 'show_pagination', 'star_color', 'item_color_scheme', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `featured-collection` (id=featured_collection_ndkXr3, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `cascading-product` (id=cascading_product_7CmzAG, settings=['color_scheme', 'container', 'collection', 'product_to_show', 'heading', 'heading_size', 'heading_alignment', 'overlay_heading', 'spacing', 'variance', 'sequence', 'column_gap', 'cascade_enable_parallax', 'cascade_parallax_intensity', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `cascading-product` (id=cascading_product_YB6B93, settings=['color_scheme', 'container', 'collection', 'product_to_show', 'heading', 'heading_size', 'heading_alignment', 'overlay_heading', 'spacing', 'variance', 'sequence', 'column_gap', 'cascade_enable_parallax', 'cascade_parallax_intensity', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=custom_content_btgYN3, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `featured-collection` (id=featured_collection_ATHd3r, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'color_scheme', 'container', 'collection', 'enable_flashsale', 'show_countdown', 'product_to_show', 'items_per_row', 'item_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'show_button_on_header', 'button_type', 'button_text', 'button_style', 'button_size', 'infinite_load', 'max_page_load', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `brands-list` (id=brands_list_XfN79B, settings=['heading', 'heading_size', 'subheading', 'header_alignment', 'container', 'color_scheme', 'item_per_row', 'column_gap', 'row_gap', 'column_gap_mobile', 'row_gap_mobile', 'enable_slider', 'show_nav', 'show_pagination', 'autorotate', 'autorotate_speed', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `collapsible-tabs` (id=collapsible_tabs_DtLJKf, settings=['container', 'color_scheme', 'image_position', 'column_gap', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'padding_top', 'padding_bottom', 'enable_preload_image', 'animations', 'custom_class'])

### list-collections
- Sections (ordre) :
  1. `collection-list-template` (id=main, settings=['container', 'display_type', 'title', 'description', 'header_alignment', 'items_per_row', 'item_gap', 'mobile_columns', 'mobile_gap', 'card_style', 'text_alignment', 'hover_effect', 'show_product_count', 'count_inline_title', 'image_rounded'])

### page.about-us
- Sections (ordre) :
  1. `page-about-us` (id=main, settings=[])
  1. `custom-content` (id=custom-content, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `rich-text` (id=rich_text_Qkhe6r, settings=['container', 'color_scheme', 'content_alignment', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### page.contact
- Sections (ordre) :
  1. `page-contact` (id=main, settings=['container'])
  1. `contact-form` (id=contact-form, settings=['container', 'title', 'description', 'show_name', 'show_phone', 'show_signup_email', 'animations'])
  1. `rich-text` (id=rich_text_VXTULD, settings=['container', 'color_scheme', 'content_alignment', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### page.faqs
- Sections (ordre) :
  1. `breadcrumb` (id=breadcrumb_RHyjx4, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `custom-content` (id=custom_content_tAfTRN, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `page-faqs` (id=main, settings=['container', 'color_scheme', 'menu', 'custom_class'])
  1. `collapsible-tabs` (id=collapsible_tabs_aPdAHg, settings=['container', 'color_scheme', 'image_position', 'column_gap', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'padding_top', 'padding_bottom', 'enable_preload_image', 'animations', 'custom_class'])

### page.find-a-store
- Sections (ordre) :
  1. `custom-code` (id=3e26d8d1-3cda-4cf6-b659-e1e118b00070, settings=['custom_css'])
  1. `page-find-a-store` (id=main, settings=['container', 'gap', 'gap_mobile'])

### page
- Sections (ordre) :
  1. `page` (id=main, settings=[])

### page.product-compare
- Sections (ordre) :
  1. `page-product-compare` (id=main, settings=[])

### page.wishlist
- Sections (ordre) :
  1. `page-wishlist` (id=main, settings=[])

### password
- Layout : `password`
- Sections (ordre) :
  1. `password-template` (id=main, settings=['bg_color', 'show_logo', 'logo_max_width', 't1', 't2', 'show_n', 'n_t1', 'n_t2', 'show_p', 'p_t1', 'p_t2', 'f_t1'])

### product.custom-layout-1
- Sections (ordre) :
  1. `custom-code` (id=d880451e-1d96-4f33-80f8-fffa1f3ffaa1, settings=['custom_css'])
  1. `breadcrumb` (id=1634180644dff29e33, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=custom-content, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `apps` (id=163193713276a3d718, settings=['heading', 'heading_size', 'subheading', 'header_alignment', 'container', 'background_color', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### product.custom-layout-2
- Sections (ordre) :
  1. `custom-code` (id=aa1ffe58-248f-44be-845e-2880e9989dde, settings=['custom_css'])
  1. `breadcrumb` (id=163418101120bbaa64, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `custom-content` (id=1632107321cfdc5197, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `custom-content` (id=1632108447382846c2, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=1632119012258c1f2d, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `custom-content` (id=16321193015b384c59, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'enable_preload_image', 'custom_class'])
  1. `product-reviews` (id=163214992002cf024a, settings=['container', 'heading', 'custom_liquid'])
  1. `product-recommendations` (id=163221161150addf60, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=16322116198620330d, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### product.custom-layout-3
- Sections (ordre) :
  1. `custom-code` (id=8ead94b7-1d54-4b75-8fc3-c14d73e40c40, settings=['custom_css'])
  1. `breadcrumb` (id=1634180978b4c2d04e, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `custom-content` (id=16321209498358375a, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=1632121366c4f232a6, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'default_open', 'animations'])
  1. `custom-content` (id=custom-content, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=16321223299044c3c4, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=163212221043dfbbca, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `apps` (id=163193713276a3d718, settings=['heading', 'subheading', 'header_alignment', 'container', 'background_color', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-recommendations` (id=1632211714a9cfeba1, settings=['container', 'heading', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'animations'])
  1. `recent-viewed-products` (id=16322117236c87f36b, settings=['container', 'heading', 'limit', 'columns', 'column_gap', 'enable_slider'])

### product.custom-layout-4
- Sections (ordre) :
  1. `custom-code` (id=bd55b00c-c0c3-4d81-a2fe-af7a03a9892e, settings=['custom_css'])
  1. `breadcrumb` (id=1634180587c910711e, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'default_open', 'animations'])
  1. `custom-content` (id=custom-content, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=163212164016351730, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=163212177275e99b4c, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'heading', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'animations'])
  1. `product-reviews` (id=16321491731d2c8073, settings=['container', 'heading', 'custom_liquid'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'heading', 'limit', 'columns', 'column_gap', 'enable_slider'])

### product.custom-layout-5
- Sections (ordre) :
  1. `custom-code` (id=7e718e08-9f95-4ef8-ba62-8265bcfb25e8, settings=['custom_css'])
  1. `breadcrumb` (id=16341808481d69045d, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'default_open', 'animations'])
  1. `custom-content` (id=custom-content, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=1632219950128bb020, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=163212177275e99b4c, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `icon-box` (id=16322217957dfd92bd, settings=['container', 'heading', 'subheading', 'description', 'header_alignment', 'item_per_row', 'item_gap', 'item_gap_mobile', 'card_style', 'image_max_width', 'content_alignment', 'hover_effect', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'use_grid_column_mb', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=1632221802903645b4, settings=['heading', 'subheading', 'description', 'header_alignment', 'container', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'heading', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'animations'])
  1. `product-reviews` (id=16321491731d2c8073, settings=['container', 'heading', 'custom_liquid'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'heading', 'limit', 'columns', 'column_gap', 'enable_slider'])

### product.grid-1-column
- Sections (ordre) :
  1. `breadcrumb` (id=breadcrumb, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `empty-space` (id=empty_space_LLcWJh, settings=['container', 'color_scheme', 'show_divider_line', 'divider_style', 'divider_height', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `image-with-text` (id=image_with_text_gHJgwp, settings=['heading', 'heading_size', 'subheading', 'container', 'color_scheme', 'item_gap', 'item_gap_mobile', 'layout', 'image_column_size', 'image_overlap', 'show_image_reverse', 'hover_effect', 'image_animation', 'link', 'link_2', 'second_image_offset_top', 'title', 'sub_title', 'text', 'text_size', 'content_alignment', 'button_label', 'button_link', 'button_style', 'button_size', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `collapsible-tabs` (id=collapsible_tabs_JndiBV, settings=['container', 'color_scheme', 'image_position', 'column_gap', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'padding_top', 'padding_bottom', 'animations', 'custom_class'])
  1. `testimonials` (id=testimonials_BKNQ7A, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'design', 'show_stars', 'autorotate', 'show_navigation', 'show_pagination', 'star_color', 'item_color_scheme', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=custom_content_wNQbUj, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `image-comparison` (id=image_comparison_UR747F, settings=['container', 'color_scheme', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'layout', 'image_height', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### product.grid-2-columns
- Sections (ordre) :
  1. `breadcrumb` (id=breadcrumb, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `image-with-text` (id=image_with_text_q7mwUN, settings=['heading', 'heading_size', 'subheading', 'container', 'color_scheme', 'item_gap', 'item_gap_mobile', 'layout', 'image_column_size', 'image_overlap', 'show_image_reverse', 'hover_effect', 'image_animation', 'link', 'link_2', 'second_image_offset_top', 'title', 'sub_title', 'text', 'text_size', 'content_alignment', 'button_label', 'button_link', 'button_style', 'button_size', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `image-with-text` (id=image_with_text_GwjQnM, settings=['heading', 'heading_size', 'subheading', 'container', 'color_scheme', 'item_gap', 'item_gap_mobile', 'layout', 'image_column_size', 'image_overlap', 'show_image_reverse', 'hover_effect', 'image_animation', 'link', 'link_2', 'second_image_offset_top', 'title', 'sub_title', 'text', 'text_size', 'content_alignment', 'button_label', 'button_link', 'button_style', 'button_size', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `press` (id=press_BbxDFT, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'show_divider', 'autoplay', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `icon-box` (id=icon_box_9UtNky, settings=['container', 'color_scheme', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'item_per_row', 'item_gap', 'item_gap_mobile', 'card_style', 'image_max_width', 'content_alignment', 'hover_effect', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'use_grid_column_mb', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### product.grid-mix-columns
- Sections (ordre) :
  1. `breadcrumb` (id=breadcrumb, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `icon-box` (id=icon_box_9UtNky, settings=['container', 'color_scheme', 'heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'item_per_row', 'item_gap', 'item_gap_mobile', 'card_style', 'image_max_width', 'content_alignment', 'hover_effect', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'use_grid_column_mb', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `image-with-text` (id=image_with_text_n33U47, settings=['heading', 'heading_size', 'subheading', 'container', 'color_scheme', 'item_gap', 'item_gap_mobile', 'layout', 'image_column_size', 'image_overlap', 'show_image_reverse', 'hover_effect', 'image_animation', 'link', 'link_2', 'second_image_offset_top', 'title', 'sub_title', 'text', 'text_size', 'content_alignment', 'button_label', 'button_link', 'button_style', 'button_size', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `custom-content` (id=custom_content_bFWCiW, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `scrolling-promotion` (id=scrolling_promotion_ViawXq, settings=['container', 'direction', 'speed', 'item_gap', 'item_gap_mobile', 'color_scheme', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `empty-space` (id=empty_space_WtAVGr, settings=['container', 'color_scheme', 'show_divider_line', 'divider_style', 'divider_height', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `custom-content` (id=custom_content_tLXyFQ, settings=['heading', 'heading_size', 'subheading', 'description', 'header_alignment', 'container', 'color_scheme', 'content_color_scheme', 'enable_parallax', 'parallax_direction', 'gap', 'gap_mobile', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class'])
  1. `hotspots-image` (id=hotspots_image_XjaniW, settings=['container', 'color_scheme', 'image_max_width', 'heading_size', 'padding_top', 'padding_bottom', 'custom_class', 'animations', 'enable_bg_zoom_effect'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### product
- Sections (ordre) :
  1. `breadcrumb` (id=breadcrumb, settings=['container', 'text_alignment', 'hide_current', 'hide_on_mb', 'animations'])
  1. `main-product` (id=main, settings=['container', 'layout', 'show_atwl', 'enable_history_state', 'enable_variant_group_images', 'disable_selected_variant_default', 'show_featured_media', 'show_zoom_button', 'enable_video_autoplay', 'show_nav_media_mobile', 'show_pagination_mobile', 'use_sticky_atc', 'use_sticky_atc_on_mobile', 'enable_dynamic_checkout', 'sticky_atc_wishtlist', 'sticky_atc_compare'])
  1. `product-details-tabs` (id=product-details-tabs, settings=['container', 'color_scheme', 'default_open', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `product-recommendations` (id=product-recommendations, settings=['container', 'color_scheme', 'remove_params', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'enable_slider', 'show_pagination', 'show_navigation', 'use_scroll_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])
  1. `recent-viewed-products` (id=recent-viewed-products, settings=['container', 'color_scheme', 'heading', 'heading_size', 'text_align', 'limit', 'columns', 'column_gap', 'pcard_layout', 'pcard_image_ratio', 'show_vendor', 'hide_title', 'enable_slider', 'show_pagination', 'show_navigation', 'mobile_disable_slider', 'use_scroll_mobile', 'item_gap_mobile', 'padding_top', 'padding_bottom', 'custom_class', 'animations'])

### search
- Sections (ordre) :
  1. `page-search` (id=main, settings=['container', 'results_per_page', 'show_sorting', 'show_filter', 'show_product_count', 'change_product_variant_on_fitlering', 'sidebar_title', 'collapsed_groups', 'color_swatches', 'limit_height_widget', 'limit_height'])

## Snippets
Total snippets : 121
- `snippets/agree-terms-checkbox.liquid`
- `snippets/article-card-placeholder.liquid`
- `snippets/article-card.liquid`
- `snippets/blog-sidebar.liquid`
- `snippets/breadcrumb.liquid`
- `snippets/cart-addons.liquid`
- `snippets/cart-drawer-item.liquid`
- `snippets/cart-drawer.liquid`
- `snippets/cart-line-item.liquid`
- `snippets/cart.liquid`
- `snippets/cascade-collection-card.liquid`
- `snippets/cascade-product-card-placeholder.liquid`
- `snippets/cascade-product-card.liquid`
- `snippets/cascade.liquid`
- `snippets/collection-card.liquid`
- `snippets/collection-filters-facets.liquid`
- `snippets/collection-page-toolbar.liquid`
- `snippets/collection-sidebar.liquid`
- `snippets/collection-tab.liquid`
- `snippets/cookie-banner.liquid`
- `snippets/countdown-timer.liquid`
- `snippets/country-selector.liquid`
- `snippets/critical-css.liquid`
- `snippets/currency-switcher.liquid`
- `snippets/custom-code-body.liquid`
- `snippets/custom-code-head.liquid`
- `snippets/customer-challenge-style.liquid`
- `snippets/customer-navs.liquid`
- `snippets/customer-orders.liquid`
- `snippets/filter-by-tags.liquid`
- `snippets/font-face.liquid`
- `snippets/footer-block__html.liquid`
- `snippets/footer-block__menu.liquid`
- `snippets/footer-block__text.liquid`
- `snippets/footer-blocks.liquid`
- `snippets/footer-design.liquid`
- `snippets/form__ask-a-question.liquid`
- `snippets/form__error.liquid`
- `snippets/form__success.liquid`
- `snippets/foxkit-preorder-badge.liquid`
- `snippets/get_swatch_texture.liquid`
- `snippets/gift-card-recipient-form.liquid`
- `snippets/header-logo.liquid`
- `snippets/header-main-menu-container.liquid`
- `snippets/header-menu-drawer.liquid`
- `snippets/header-option-item__account.liquid`
- `snippets/header-option-item__compare.liquid`
- `snippets/header-option-item__search.liquid`
- `snippets/header-option-item__wishlist.liquid`
- `snippets/header__topbar.liquid`
- `snippets/icon-3d-model.liquid`
- `snippets/icon-play.liquid`
- `snippets/icon-testimonials.liquid`
- `snippets/icon.liquid`
- `snippets/image-card.liquid`
- `snippets/index-section-header.liquid`
- `snippets/language-switcher.liquid`
- `snippets/lookbook-card-slider.liquid`
- `snippets/lookbook-card.liquid`
- `snippets/lookbook-hero.liquid`
- `snippets/main-product-blocks.liquid`
- `snippets/mega-menu-customer.liquid`
- `snippets/mega-menu-link.liquid`
- `snippets/mm-judgeme-widgets.liquid`
- `snippets/mm-socialshopwave-widget-recommends.liquid`
- `snippets/mm-ssw-widget-avg-rate-listing.liquid`
- `snippets/mm-ssw-widget-faveicon.liquid`
- `snippets/new-locale.liquid`
- `snippets/newsletter-form.liquid`
- `snippets/other-review-app-snippet.liquid`
- `snippets/page-title.liquid`
- `snippets/page-transition.liquid`
- `snippets/pagination.liquid`
- `snippets/payment-icons.liquid`
- `snippets/product-card-1.liquid`
- `snippets/product-card-2.liquid`
- `snippets/product-card-3.liquid`
- `snippets/product-card-4.liquid`
- `snippets/product-card-5.liquid`
- `snippets/product-card-bundle.liquid`
- `snippets/product-card-option.liquid`
- `snippets/product-card-quick-add-btn.liquid`
- `snippets/product-data.liquid`
- `snippets/product-form.liquid`
- `snippets/product-media.liquid`
- `snippets/product-prices.liquid`
- `snippets/product-qty-input.liquid`
- `snippets/product-reviews-app__badge.liquid`
- `snippets/product-reviews-app__snippet.liquid`
- `snippets/product-tags.liquid`
- `snippets/product-thumbnail.liquid`
- `snippets/product-variant-options.liquid`
- `snippets/product-variant-picker.liquid`
- `snippets/quick-order-list-row.liquid`
- `snippets/responsive-image.liquid`
- `snippets/script-tags.liquid`
- `snippets/scroll-top-button.liquid`
- `snippets/search-popup.liquid`
- `snippets/selected-tags-filter.liquid`
- `snippets/shop-this-look.liquid`
- `snippets/slider-controls.liquid`
- `snippets/social-media-links.liquid`
- `snippets/social-meta-tags.liquid`
- `snippets/social-sharing.liquid`
- `snippets/sort-by-mobile.liquid`
- `snippets/sticky-atc.liquid`
- `snippets/storefront-filters.liquid`
- `snippets/style-tags.liquid`
- `snippets/swatch-input.liquid`
- `snippets/testimonials-1.liquid`
- `snippets/testimonials-2.liquid`
- `snippets/testimonials-3.liquid`
- `snippets/testimonials-4.liquid`
- `snippets/testimonials-5.liquid`
- `snippets/testimonials-6.liquid`
- `snippets/testimonials-7.liquid`
- `snippets/testimonials-8.liquid`
- `snippets/theme-data.liquid`
- `snippets/theme-info.liquid`
- `snippets/tooltip.liquid`
- `snippets/video-card.liquid`

## Assets
### css (80)
- `assets/about-us.css`
- `assets/age-verifier.css`
- `assets/article.css`
- `assets/banner-with-slider.css`
- `assets/blog-post.css`
- `assets/blog-sidebar.css`
- `assets/blog.css`
- `assets/brands-list.css`
- `assets/cart.css`
- `assets/cascading.css`
- `assets/collage-tabs.css`
- `assets/collection-header.css`
- `assets/collection-image-showcase.css`
- `assets/collection-list.css`
- `assets/collection-showcase.css`
- `assets/collection-tabs.css`
- `assets/collection.css`
- `assets/component-article-card.css`
- `assets/component-cascading-collection-card.css`
- `assets/component-cascading-product-card.css`
- ... and 60 more

### js (74)
- `assets/age-verifier.js`
- `assets/animations.js`
- `assets/announcement-bar.js`
- `assets/ask-question.js`
- `assets/banner-with-slider.js`
- `assets/brands-list.js`
- `assets/cart.js`
- `assets/cascading-parallax.js`
- `assets/collage-tabs.js`
- `assets/collection-image-showcase.js`
- `assets/collection-list.js`
- `assets/collection-showcase.js`
- `assets/collection-tabs.js`
- `assets/collection.js`
- `assets/compare-product.js`
- `assets/countdown-timer.js`
- `assets/customer.js`
- `assets/facet-remove.js`
- `assets/favorite-product-slider.js`
- `assets/featured-collection.js`
- ... and 54 more

### liquid (1)
- `assets/custom.css.liquid`

### png (2)
- `assets/filter_color1.png`
- `assets/filter_color2.png`

### svg (3)
- `assets/ar-down.svg`
- `assets/arrow-down-white.svg`
- `assets/arrow-down.svg`

## Locales
Total locale files : 31
- `locales/bg.json`
- `locales/cs.json`
- `locales/da.json`
- `locales/de.json`
- `locales/el.json`
- `locales/en.default.json`
- `locales/es.json`
- `locales/fi.json`
- `locales/fr.json`
- `locales/hr.json`
- `locales/hu.json`
- `locales/id.json`
- `locales/it.json`
- `locales/ja.json`
- `locales/ko.json`
- `locales/lt.json`
- `locales/nb.json`
- `locales/nl.json`
- `locales/pl.json`
- `locales/pt-BR.json`
- `locales/pt-PT.json`
- `locales/ro.json`
- `locales/ru.json`
- `locales/sk.json`
- `locales/sl.json`
- `locales/sv.json`
- `locales/th.json`
- `locales/tr.json`
- `locales/vi.json`
- `locales/zh-CN.json`
- `locales/zh-TW.json`

## Layout files
Total layout files : 2
- `layout/password.liquid`
- `layout/theme.liquid`

## Detected features
- Bannière cookies
- Bannière slider
- Barre d'annonces
- Bundles de produits
- Comparaison de produits
- Comparateur d'images
- Compte à rebours / flash sale
- Emballage cadeau
- Formulaire poser une question
- Image avec points interactifs
- Liste de souhaits / favoris
- Lookbook
- Mega menu
- Onglets de collections
- Prix par volume
- Quick view produit
- Récemment consultés
- Sticky add to cart
- Support RTL
- Vérification d'âge

## React mapping proposal

### Global components
- `ThemeProvider` — injecte les `settings_data`, les locales, le panier et le currency.
- `Layout` — wrapper `<html lang=...>`, `<head>` SEO, favicon, CSS/JS globaux.
- `CartProvider` — état panier, drawer, quick view, add-to-cart AJAX.
- `SearchProvider` — search predictive, filters.

### Page templates (Next.js App Router)
- `app/[locale]/404/page.tsx`
  - `<404Template />`
  - `<CustomLiquid />`

- `app/[locale]/article/page.tsx`
  - `<Article />`

- `app/[locale]/blog/page.tsx`
  - `<BlogTemplate />`

- `app/[locale]/cart/page.tsx`
  - `<CartTemplate />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.canvas-sidebar/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.custom-content-banner/page.tsx`
  - `<CollectionList />`
  - `<EmptySpace />`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.filter-by-tags/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.filter-left-sidebar/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.filter-right-sidebar/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.flash-sale/page.tsx`
  - `<CollectionPageHeader />`
  - `<FlashSale />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.full-width/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.grid-2-columns/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.grid-3-columns/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.grid-4-columns/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.grid-5-columns/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.hidden-sidebar/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.infinite-scroll/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.load-more-button/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/collection.view-list/page.tsx`
  - `<CollectionPageHeader />`
  - `<MainCollectionProductGrid />`
  - `<RecentViewedProducts />`

- `app/[locale]/account/page.tsx`
  - `<MainAccount />`

- `app/[locale]/activate_account/page.tsx`
  - `<MainActivateAccount />`

- `app/[locale]/addresses/page.tsx`
  - `<MainAddresses />`

- `app/[locale]/login/page.tsx`
  - `<MainLogin />`

- `app/[locale]/order/page.tsx`
  - `<MainOrder />`

- `app/[locale]/register/page.tsx`
  - `<MainRegister />`

- `app/[locale]/reset_password/page.tsx`
  - `<MainResetPassword />`

- `app/[locale]/index/page.tsx`
  - `<Slider />`
  - `<ScrollingPromotion />`
  - `<CollectionList />`
  - `<Video />`
  - `<FeaturedCollection />`
  - `<FeaturedCollection />`
  - `<FeaturedCollection />`
  - `<ProductTabs />`
  - `<IconBox />`
  - `<ProductTabs />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<FeaturedCollection />`
  - `<FeaturedCollection />`
  - `<Testimonials />`
  - `<FeaturedCollection />`
  - `<CascadingProduct />`
  - `<CascadingProduct />`
  - `<CustomContent />`
  - `<FeaturedCollection />`
  - `<BrandsList />`
  - `<CollapsibleTabs />`

- `app/[locale]/list-collections/page.tsx`
  - `<CollectionListTemplate />`

- `app/[locale]/page.about-us/page.tsx`
  - `<PageAboutUs />`
  - `<CustomContent />`
  - `<RichText />`

- `app/[locale]/page.contact/page.tsx`
  - `<PageContact />`
  - `<ContactForm />`
  - `<RichText />`

- `app/[locale]/page.faqs/page.tsx`
  - `<Breadcrumb />`
  - `<CustomContent />`
  - `<PageFaqs />`
  - `<CollapsibleTabs />`

- `app/[locale]/page.find-a-store/page.tsx`
  - `<CustomCode />`
  - `<PageFindAStore />`

- `app/[locale]/page/page.tsx`
  - `<Page />`

- `app/[locale]/page.product-compare/page.tsx`
  - `<PageProductCompare />`

- `app/[locale]/page.wishlist/page.tsx`
  - `<PageWishlist />`

- `app/[locale]/password/page.tsx`
  - `<PasswordTemplate />`

- `app/[locale]/product.custom-layout-1/page.tsx`
  - `<CustomCode />`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<CustomContent />`
  - `<Apps />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.custom-layout-2/page.tsx`
  - `<CustomCode />`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<ProductDetailsTabs />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<ProductReviews />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.custom-layout-3/page.tsx`
  - `<CustomCode />`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<ProductDetailsTabs />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<Apps />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.custom-layout-4/page.tsx`
  - `<CustomCode />`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<ProductRecommendations />`
  - `<ProductReviews />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.custom-layout-5/page.tsx`
  - `<CustomCode />`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<CustomContent />`
  - `<IconBox />`
  - `<CustomContent />`
  - `<ProductRecommendations />`
  - `<ProductReviews />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.grid-1-column/page.tsx`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<EmptySpace />`
  - `<ImageWithText />`
  - `<CollapsibleTabs />`
  - `<Testimonials />`
  - `<CustomContent />`
  - `<ImageComparison />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/product.grid-2-columns/page.tsx`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<ImageWithText />`
  - `<ImageWithText />`
  - `<Press />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`
  - `<IconBox />`

- `app/[locale]/product.grid-mix-columns/page.tsx`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<IconBox />`
  - `<ImageWithText />`
  - `<CustomContent />`
  - `<ScrollingPromotion />`
  - `<EmptySpace />`
  - `<CustomContent />`
  - `<HotspotsImage />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/product/page.tsx`
  - `<Breadcrumb />`
  - `<MainProduct />`
  - `<ProductDetailsTabs />`
  - `<ProductRecommendations />`
  - `<RecentViewedProducts />`

- `app/[locale]/search/page.tsx`
  - `<PageSearch />`


### Section → React component mapping (all)

- `footer-group` → `<FooterGroup />` (props: settings + blocks)
- `header-group` → `<HeaderGroup />` (props: settings + blocks)

## Proposals / Observations

1. **Data model** : le thème repose sur `settings_schema` + `settings_data` + sections JSON. En React/Next, il faut remplacer ce trio par un store de config côté backend (`store-config`) et des blocs normalisés.
2. **CSS** : ~100 fichiers CSS atomiques (`assets/*.css`) + `main.css`. Il faut les migrer en Tailwind/CSS variables ou au moins les bundler avec Vite/Webpack.
3. **JS** : de nombreux scripts vanilla (`assets/*.js`) manipulent le DOM. À migrer en hooks React (ex. `useCart`, `useSearch`, `useLocalization`).
4. **Liquid** : les snippets/templates utilisent `{% render %}`. L'équivalent React = composants réutilisables avec props typées.
5. **Images** : `assets/` contient aussi des SVG/PNGs (flèches, logos, filtres couleur). À externaliser dans `public/` ou `app/icons/`.
6. **Locales** : translations clés par fichier de langue. À fusionner dans `messages/fr.json`, `messages/en.json`, etc.
7. **Sections Shopify** : la plupart sont déjà des blocs autonomes, donc la correspondance React 1:1 est directe. Le gros travail est le parsing des `settings` en props React + validation Zod.
8. **Features avancées** : mega-menu, quick-view, compare, wishlist, flash-sale nécessitent un state manager (React Context / Zustand) + API Medusa.
9. **Priorité** : commencer par `theme.liquid` (layout), puis `index.json`, `product.json`, `collection.json` ; enfin le cart drawer.