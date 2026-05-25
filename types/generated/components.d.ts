import type { Schema, Struct } from '@strapi/strapi';

export interface CheckoutPlantPickupDate extends Struct.ComponentSchema {
  collectionName: 'components_checkout_plant_pickup_dates';
  info: {
    displayName: 'PlantPickupDate';
  };
  attributes: {
    Date: Schema.Attribute.Date;
  };
}

export interface CheckoutShippingBlackoutDates extends Struct.ComponentSchema {
  collectionName: 'components_checkout_shipping_blackout_dates';
  info: {
    displayName: 'ShippingBlackoutDates';
  };
  attributes: {
    BlackoutDate: Schema.Attribute.Date;
  };
}

export interface CheckoutTransitThreshold extends Struct.ComponentSchema {
  collectionName: 'components_checkout_transit_thresholds';
  info: {
    description: 'Transit day threshold for dry ice calculation';
    displayName: 'TransitThreshold';
  };
  attributes: {
    DryIceMultiplier: Schema.Attribute.Decimal & Schema.Attribute.Required;
    TransitDays: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface CommonCollectionCard extends Struct.ComponentSchema {
  collectionName: 'components_common_collection_cards';
  info: {
    displayName: 'CollectionCard';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Slug: Schema.Attribute.String & Schema.Attribute.Required;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_common_faq_items';
  info: {
    description: 'A single question/answer pair, used by the customer-service single type';
    displayName: 'FAQItem';
  };
  attributes: {
    Answer: Schema.Attribute.Text & Schema.Attribute.Required;
    Question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonHeaderNav extends Struct.ComponentSchema {
  collectionName: 'components_common_header_navs';
  info: {
    description: 'Mega menu navigation item with sections, featured content, and bottom bar';
    displayName: 'HeaderNav';
  };
  attributes: {
    bottomBar: Schema.Attribute.Component<'nav.bottom-bar', false>;
    featured: Schema.Attribute.Component<'nav.featured', false>;
    sections: Schema.Attribute.Component<'nav.section', true>;
    slug: Schema.Attribute.UID & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonHowItWorksCard extends Struct.ComponentSchema {
  collectionName: 'components_common_how_it_works_cards';
  info: {
    displayName: 'HowItWorksCard';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Text: Schema.Attribute.Text;
  };
}

export interface CommonLink extends Struct.ComponentSchema {
  collectionName: 'components_common_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    Text: Schema.Attribute.String & Schema.Attribute.Required;
    Url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonProductCard extends Struct.ComponentSchema {
  collectionName: 'components_common_product_cards';
  info: {
    description: '';
    displayName: 'ProductCard';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    Slug: Schema.Attribute.String & Schema.Attribute.Required;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonWhyUsList extends Struct.ComponentSchema {
  collectionName: 'components_common_why_us_lists';
  info: {
    displayName: 'WhyUsList';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface CookieCookieCategory extends Struct.ComponentSchema {
  collectionName: 'components_cookie_cookie_categories';
  info: {
    description: 'Cookie category for GDPR/CCPA consent management';
    displayName: 'CookieCategory';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
    Required: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface FooterCertificationBadge extends Struct.ComponentSchema {
  collectionName: 'components_footer_certification_badges';
  info: {
    description: 'Certification badge image and description';
    displayName: 'CertificationBadge';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterNavigationColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_navigation_columns';
  info: {
    description: 'A column of navigation links in the footer';
    displayName: 'NavigationColumn';
  };
  attributes: {
    Links: Schema.Attribute.Component<'common.link', true>;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterPaymentMethod extends Struct.ComponentSchema {
  collectionName: 'components_footer_payment_methods';
  info: {
    description: 'Payment method icon and name';
    displayName: 'PaymentMethod';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Social media link with platform name and URL';
    displayName: 'SocialLink';
  };
  attributes: {
    Platform: Schema.Attribute.Enumeration<
      [
        'Facebook',
        'Instagram',
        'Twitter',
        'YouTube',
        'LinkedIn',
        'Pinterest',
        'TikTok',
      ]
    > &
      Schema.Attribute.Required;
    Url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeBestsellers extends Struct.ComponentSchema {
  collectionName: 'components_home_bestsellers';
  info: {
    description: '';
    displayName: 'Bestsellers';
  };
  attributes: {
    Products: Schema.Attribute.Component<'common.product-card', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeBlogExplore extends Struct.ComponentSchema {
  collectionName: 'components_home_blog_explores';
  info: {
    displayName: 'BlogExplore';
  };
  attributes: {
    Button: Schema.Attribute.Component<'common.link', false>;
    CategoryLabel: Schema.Attribute.String;
    MainImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    QuoteDecorImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeFollowUs extends Struct.ComponentSchema {
  collectionName: 'components_home_followuses';
  info: {
    displayName: 'FollowUs';
  };
  attributes: {
    BigImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Description: Schema.Attribute.Text;
    SmallImages: Schema.Attribute.Media<'images' | 'files', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    BackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    BackgroundImageAlt: Schema.Attribute.String & Schema.Attribute.Required;
    CTAButton: Schema.Attribute.Component<'common.link', false>;
    Subtitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface HomeKosherPromise extends Struct.ComponentSchema {
  collectionName: 'components_home_kosher_promises';
  info: {
    description: '';
    displayName: 'KosherPromise';
  };
  attributes: {
    BadgeImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Content: Schema.Attribute.Blocks;
    FeatureImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    FeatureText: Schema.Attribute.String;
    Link: Schema.Attribute.Component<'common.link', false>;
    Title: Schema.Attribute.String;
    TopLogo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomeShopCollections extends Struct.ComponentSchema {
  collectionName: 'components_home_shop_collections';
  info: {
    description: '';
    displayName: 'ShopCollections';
  };
  attributes: {
    Collections: Schema.Attribute.Component<'common.collection-card', true>;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_home_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
  };
  attributes: {
    Author: Schema.Attribute.String;
    BackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Quote: Schema.Attribute.Blocks;
  };
}

export interface InfoFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_info_feature_cards';
  info: {
    description: 'Single feature card: optional icon, title, body.';
    displayName: 'Info Feature Card';
    icon: 'square';
  };
  attributes: {
    Body: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<'images'>;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InfoFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_info_feature_grids';
  info: {
    description: 'Grid of feature cards (1/2/3-up).';
    displayName: 'Info Feature Grid';
    icon: 'th-large';
  };
  attributes: {
    Cards: Schema.Attribute.Component<'info.feature-card', true>;
    Heading: Schema.Attribute.String;
    Intro: Schema.Attribute.Text;
  };
}

export interface InfoHero extends Struct.ComponentSchema {
  collectionName: 'components_info_heroes';
  info: {
    description: 'Hero block for legal/info pages: eyebrow, headline, subhead, image, CTAs.';
    displayName: 'Info Hero';
    icon: 'layer-group';
  };
  attributes: {
    Eyebrow: Schema.Attribute.String;
    Headline: Schema.Attribute.String & Schema.Attribute.Required;
    Image: Schema.Attribute.Media<'images'>;
    ImageAlt: Schema.Attribute.String;
    PrimaryCta: Schema.Attribute.Component<'common.link', false>;
    SecondaryCta: Schema.Attribute.Component<'common.link', false>;
    Subhead: Schema.Attribute.Text;
  };
}

export interface InfoImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_info_image_blocks';
  info: {
    description: 'Standalone image with optional caption.';
    displayName: 'Info Image Block';
    icon: 'image';
  };
  attributes: {
    Alt: Schema.Attribute.String & Schema.Attribute.Required;
    Caption: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    Width: Schema.Attribute.Enumeration<['contained', 'full']> &
      Schema.Attribute.DefaultTo<'contained'>;
  };
}

export interface InfoSection extends Struct.ComponentSchema {
  collectionName: 'components_info_sections';
  info: {
    description: 'Titled prose section with optional image.';
    displayName: 'Info Section';
    icon: 'paragraph';
  };
  attributes: {
    Body: Schema.Attribute.Blocks;
    Image: Schema.Attribute.Media<'images'>;
    ImageAlt: Schema.Attribute.String;
    ImagePosition: Schema.Attribute.Enumeration<
      ['none', 'full', 'left', 'right']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    Title: Schema.Attribute.String;
  };
}

export interface NavBottomBar extends Struct.ComponentSchema {
  collectionName: 'components_nav_bottom_bars';
  info: {
    description: 'Bottom bar section for mega menu navigation';
    displayName: 'BottomBar';
  };
  attributes: {
    certifications: Schema.Attribute.Component<'nav.certification', true>;
    viewAllText: Schema.Attribute.String;
    viewAllUrl: Schema.Attribute.String;
  };
}

export interface NavCertification extends Struct.ComponentSchema {
  collectionName: 'components_nav_certifications';
  info: {
    description: 'Certification badge for navigation bottom bar';
    displayName: 'Certification';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavFeatured extends Struct.ComponentSchema {
  collectionName: 'components_nav_featureds';
  info: {
    description: 'Featured item section for mega menu navigation';
    displayName: 'Featured';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavSection extends Struct.ComponentSchema {
  collectionName: 'components_nav_sections';
  info: {
    description: 'Navigation section with title and items';
    displayName: 'Section';
  };
  attributes: {
    items: Schema.Attribute.Component<'common.link', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PdpCleanLabels extends Struct.ComponentSchema {
  collectionName: 'components_pdp_clean_labels';
  info: {
    description: 'Production-method claims about what was NOT used (antibiotics, hormones, MSG, nitrites, nitrates, gluten, steroids).';
    displayName: 'CleanLabels';
  };
  attributes: {
    AntibioticFree: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    GlutenFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    HormoneFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoMSG: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoNitrates: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoNitrites: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoSteroids: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpCookState extends Struct.ComponentSchema {
  collectionName: 'components_pdp_cook_states';
  info: {
    description: 'How the product is sold relative to cooking: uncooked, fully cooked, ready to eat, or heat-and-serve.';
    displayName: 'CookState';
  };
  attributes: {
    FullyCooked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    HeatAndServe: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ReadyToEat: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Uncooked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpCutCharacteristics extends Struct.ComponentSchema {
  collectionName: 'components_pdp_cut_characteristics';
  info: {
    description: 'Physical attributes of the cut itself: bone, skin, trim, brisket-specific, chicken-specific, and other cut-level descriptors.';
    displayName: 'CutCharacteristics';
  };
  attributes: {
    BoneIn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Boneless: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Capon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    CowboyCut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    DeckelOn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    FirstCut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Kebab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Marrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Netted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Pargiot: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Schnitzel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Skinless: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    SkinOn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Strips: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Thickness: Schema.Attribute.String;
    Trimmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Untrimmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    WholePacker: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_pdp_how_it_works';
  info: {
    displayName: 'HowItWorks';
  };
  attributes: {
    Cards: Schema.Attribute.Component<'common.how-it-works-card', true>;
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface PdpKosherStatus extends Struct.ComponentSchema {
  collectionName: 'components_pdp_kosher_statuses';
  info: {
    description: 'Kosher certification, dairy/pareve/meat classification, and supervision level.';
    displayName: 'KosherStatus';
  };
  attributes: {
    CholovYisroel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Dairy: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    KosherForPassover: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    Meat: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Pareve: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpMedusaPrice extends Struct.ComponentSchema {
  collectionName: 'components_pdp_medusa_prices';
  info: {
    displayName: 'MedusaPrice';
  };
  attributes: {
    CalculatedPriceNumber: Schema.Attribute.Decimal;
    OriginalPriceNumber: Schema.Attribute.Decimal;
  };
}

export interface PdpMedusaProduct extends Struct.ComponentSchema {
  collectionName: 'components_pdp_medusa_products';
  info: {
    description: '';
    displayName: 'MedusaProduct';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Handle: Schema.Attribute.String;
    PricingMode: Schema.Attribute.Enumeration<['per_lb', 'fixed_price']>;
    ProductId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    QuickBooksListId: Schema.Attribute.String;
    ShortDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    Status: Schema.Attribute.Enumeration<
      ['draft', 'proposed', 'published', 'rejected']
    >;
    Title: Schema.Attribute.String;
    Variants: Schema.Attribute.Component<'pdp.medusa-variants', true>;
  };
}

export interface PdpMedusaVariants extends Struct.ComponentSchema {
  collectionName: 'components_pdp_medusa_variants';
  info: {
    displayName: 'MedusaVariants';
  };
  attributes: {
    Price: Schema.Attribute.Component<'pdp.medusa-price', false>;
    QuickBooksListId: Schema.Attribute.String;
    Sku: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    VariantId: Schema.Attribute.String;
  };
}

export interface PdpPackagingFormat extends Struct.ComponentSchema {
  collectionName: 'components_pdp_packaging_formats';
  info: {
    description: 'How the product is packaged: vacuum-packed, bulk pack, boilable pouch, aluminum pan, IQF.';
    displayName: 'PackagingFormat';
  };
  attributes: {
    AluminumPan: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    BoilablePouch: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    BulkPack: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    IQF: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    VacuumPacked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpPreparationStyle extends Struct.ComponentSchema {
  collectionName: 'components_pdp_preparation_styles';
  info: {
    description: 'How the product was processed before sale: smoked, pickled, cured, marinated, sliced, ground, etc.';
    displayName: 'PreparationStyle';
  };
  attributes: {
    Bulk: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    CharGrilled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Cured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Ground: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    MarinadeFlavor: Schema.Attribute.String;
    Marinated: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Offcut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Pickled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Sliced: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Smoked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpProductImage extends Struct.ComponentSchema {
  collectionName: 'components_pdp_product_images';
  info: {
    description: 'Product image with accessibility and ordering';
    displayName: 'ProductImage';
  };
  attributes: {
    AltText: Schema.Attribute.String & Schema.Attribute.Required;
    Caption: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    IsPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    SortOrder: Schema.Attribute.Integer;
  };
}

export interface PdpProductMetadata extends Struct.ComponentSchema {
  collectionName: 'components_pdp_product_metadata';
  info: {
    displayName: 'ProductMetadata';
  };
  attributes: {
    AluminumPan: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Angus: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    AntibioticFree: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    AvgPackSize: Schema.Attribute.String;
    AvgPackWeight: Schema.Attribute.String;
    BoilablePouch: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    BoneIn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Boneless: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Brand: Schema.Attribute.String;
    Breed: Schema.Attribute.String;
    Bulk: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    BulkPack: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Capon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    CharGrilled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    CholovYisroel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Cooked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    CowboyCut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Cured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Dairy: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    DeckelOn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    FirstCut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    FreeRange: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    GlutenFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    GrainFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    GrassFed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Ground: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    HeatAndServe: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    HormoneFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    IQF: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Kebab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    KosherForPassover: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    MarinadeFlavor: Schema.Attribute.String;
    Marinated: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Marrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Meat: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    MSG: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Netted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoNitrates: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoNitrites: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    NoSteroids: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Offcut: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Organic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Origin: Schema.Attribute.String;
    Pareve: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Pargiot: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Pickled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    PiecesPerPack: Schema.Attribute.Integer;
    Schnitzel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Serves: Schema.Attribute.String;
    Skinless: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    SkinOn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Sliced: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Smoked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Source: Schema.Attribute.String;
    SouthAmerican: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Strips: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Supplier: Schema.Attribute.String;
    Thickness: Schema.Attribute.String;
    Trimmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Uncooked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Untrimmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    VacuumPacked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    WholePacker: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PdpSategorization extends Struct.ComponentSchema {
  collectionName: 'components_pdp_sategorizations';
  info: {
    description: '';
    displayName: '\u0421ategorization';
    icon: 'stack';
  };
  attributes: {
    ProductCollections: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-collection.product-collection'
    >;
    ProductTags: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-tag.product-tag'
    >;
  };
}

export interface PdpSourcing extends Struct.ComponentSchema {
  collectionName: 'components_pdp_sourcings';
  info: {
    description: 'Where the product comes from and how the animal was raised.';
    displayName: 'Sourcing';
  };
  attributes: {
    Angus: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Brand: Schema.Attribute.String;
    Breed: Schema.Attribute.String;
    FreeRange: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    GrainFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    GrassFed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Organic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Origin: Schema.Attribute.String;
    Source: Schema.Attribute.String;
    SouthAmerican: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Supplier: Schema.Attribute.String;
  };
}

export interface PdpWhyUs extends Struct.ComponentSchema {
  collectionName: 'components_pdp_whyuses';
  info: {
    displayName: 'WhyUs';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    List: Schema.Attribute.Component<'common.why-us-list', true>;
    Title: Schema.Attribute.String;
  };
}

export interface RecipeIngredient extends Struct.ComponentSchema {
  collectionName: 'components_recipe_ingredients';
  info: {
    description: 'Single ingredient with amount and name';
    displayName: 'Ingredient';
    icon: 'carrot';
  };
  attributes: {
    ingredient: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface RecipeNutritionInfo extends Struct.ComponentSchema {
  collectionName: 'components_recipe_nutrition_infos';
  info: {
    description: 'Nutritional information for recipes (supports Recipe schema.org)';
    displayName: 'NutritionInfo';
  };
  attributes: {
    Calories: Schema.Attribute.Integer;
    Carbohydrates: Schema.Attribute.Decimal;
    Fat: Schema.Attribute.Decimal;
    Fiber: Schema.Attribute.Decimal;
    Protein: Schema.Attribute.Decimal;
    ServingSize: Schema.Attribute.String;
    Sodium: Schema.Attribute.Decimal;
    Sugar: Schema.Attribute.Decimal;
  };
}

export interface RecipeStep extends Struct.ComponentSchema {
  collectionName: 'components_recipe_steps';
  info: {
    description: 'Instruction step for recipe';
    displayName: 'Step';
    icon: 'list-ol';
  };
  attributes: {
    instruction: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedCertification extends Struct.ComponentSchema {
  collectionName: 'components_shared_certifications';
  info: {
    description: 'Certification badge with image and link';
    displayName: 'Certification';
  };
  attributes: {
    AltText: Schema.Attribute.String & Schema.Attribute.Required;
    BadgeImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    LinkUrl: Schema.Attribute.String;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_shared_newsletters';
  info: {
    description: 'Newsletter signup section for email marketing';
    displayName: 'Newsletter';
  };
  attributes: {
    ButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Subscribe'>;
    Description: Schema.Attribute.Text;
    ErrorMessage: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please enter a valid email'>;
    PlaceholderText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Enter your email'>;
    SuccessMessage: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Thanks for subscribing!'>;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOrganization extends Struct.ComponentSchema {
  collectionName: 'components_shared_organizations';
  info: {
    description: 'Organization information for schema.org structured data';
    displayName: 'Organization';
  };
  attributes: {
    City: Schema.Attribute.String;
    Country: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'United States'>;
    Email: Schema.Attribute.Email;
    Phone: Schema.Attribute.String;
    PostalCode: Schema.Attribute.String;
    SocialProfiles: Schema.Attribute.JSON;
    State: Schema.Attribute.String;
    StreetAddress: Schema.Attribute.String;
  };
}

export interface SharedPaymentMethods extends Struct.ComponentSchema {
  collectionName: 'components_shared_payment_methods';
  info: {
    description: 'Payment method icon display configuration';
    displayName: 'PaymentMethods';
  };
  attributes: {
    ShowAmex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowApplePay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowDiscover: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowGooglePay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowMastercard: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowPayPal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowVisa: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Core SEO settings for search engines and AI indexing';
    displayName: 'SEO';
    icon: 'search';
    name: 'Seo';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaRobots: Schema.Attribute.Enumeration<
      [
        'index, follow',
        'noindex, follow',
        'index, nofollow',
        'noindex, nofollow',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
        minLength: 1;
      }>;
    metaViewport: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'width=device-width, initial-scale=1'>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedShippingZoneBreakpoints extends Struct.ComponentSchema {
  collectionName: 'components_shared_shipping_zone_breakpoints';
  info: {
    displayName: 'Shipping Zone Breakpoints';
    icon: 'rotate';
  };
  attributes: {
    BreakpointPrice: Schema.Attribute.Decimal;
    ShippingRate: Schema.Attribute.Decimal;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media platform URLs';
    displayName: 'SocialLinks';
  };
  attributes: {
    Facebook: Schema.Attribute.String;
    Instagram: Schema.Attribute.String;
    Pinterest: Schema.Attribute.String;
    TikTok: Schema.Attribute.String;
    Twitter: Schema.Attribute.String;
    YouTube: Schema.Attribute.String;
  };
}

export interface SharedSocialMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_metas';
  info: {
    description: 'Open Graph and Twitter Card metadata for social sharing';
    displayName: 'Social Meta';
    icon: 'share';
    name: 'SocialMeta';
  };
  attributes: {
    ogDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogImageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogType: Schema.Attribute.Enumeration<
      ['website', 'article', 'product', 'profile']
    > &
      Schema.Attribute.DefaultTo<'website'>;
    twitterCard: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
    twitterCreator: Schema.Attribute.String;
    twitterDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    twitterImage: Schema.Attribute.Media<'images'>;
    twitterImageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    twitterSite: Schema.Attribute.String;
    twitterTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

export interface SharedTestimonialSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial_sections';
  info: {
    description: 'Reusable testimonial display component with filtering and display options';
    displayName: 'TestimonialSection';
  };
  attributes: {
    AllLinkUrl: Schema.Attribute.String;
    BackgroundColor: Schema.Attribute.String;
    DisplayStyle: Schema.Attribute.Enumeration<
      ['carousel', 'grid', 'featured-single', 'list']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'carousel'>;
    FilterByCategories: Schema.Attribute.Enumeration<
      ['Product Quality', 'Customer Service', 'Shipping', 'Overall Experience']
    >;
    FilterByTags: Schema.Attribute.Relation<'manyToMany', 'api::tag.tag'>;
    ItemsToShow: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    ShowAllLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ShowPhotos: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShowRatings: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    SortOrder: Schema.Attribute.Enumeration<
      ['date-desc', 'date-asc', 'display-order', 'random']
    > &
      Schema.Attribute.DefaultTo<'date-desc'>;
    Subtitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'checkout.plant-pickup-date': CheckoutPlantPickupDate;
      'checkout.shipping-blackout-dates': CheckoutShippingBlackoutDates;
      'checkout.transit-threshold': CheckoutTransitThreshold;
      'common.collection-card': CommonCollectionCard;
      'common.faq-item': CommonFaqItem;
      'common.header-nav': CommonHeaderNav;
      'common.how-it-works-card': CommonHowItWorksCard;
      'common.link': CommonLink;
      'common.product-card': CommonProductCard;
      'common.why-us-list': CommonWhyUsList;
      'cookie.cookie-category': CookieCookieCategory;
      'footer.certification-badge': FooterCertificationBadge;
      'footer.navigation-column': FooterNavigationColumn;
      'footer.payment-method': FooterPaymentMethod;
      'footer.social-link': FooterSocialLink;
      'home.bestsellers': HomeBestsellers;
      'home.blog-explore': HomeBlogExplore;
      'home.follow-us': HomeFollowUs;
      'home.hero': HomeHero;
      'home.kosher-promise': HomeKosherPromise;
      'home.shop-collections': HomeShopCollections;
      'home.testimonial': HomeTestimonial;
      'info.feature-card': InfoFeatureCard;
      'info.feature-grid': InfoFeatureGrid;
      'info.hero': InfoHero;
      'info.image-block': InfoImageBlock;
      'info.section': InfoSection;
      'nav.bottom-bar': NavBottomBar;
      'nav.certification': NavCertification;
      'nav.featured': NavFeatured;
      'nav.section': NavSection;
      'pdp.clean-labels': PdpCleanLabels;
      'pdp.cook-state': PdpCookState;
      'pdp.cut-characteristics': PdpCutCharacteristics;
      'pdp.how-it-works': PdpHowItWorks;
      'pdp.kosher-status': PdpKosherStatus;
      'pdp.medusa-price': PdpMedusaPrice;
      'pdp.medusa-product': PdpMedusaProduct;
      'pdp.medusa-variants': PdpMedusaVariants;
      'pdp.packaging-format': PdpPackagingFormat;
      'pdp.preparation-style': PdpPreparationStyle;
      'pdp.product-image': PdpProductImage;
      'pdp.product-metadata': PdpProductMetadata;
      'pdp.sategorization': PdpSategorization;
      'pdp.sourcing': PdpSourcing;
      'pdp.why-us': PdpWhyUs;
      'recipe.ingredient': RecipeIngredient;
      'recipe.nutrition-info': RecipeNutritionInfo;
      'recipe.step': RecipeStep;
      'shared.certification': SharedCertification;
      'shared.media': SharedMedia;
      'shared.newsletter': SharedNewsletter;
      'shared.organization': SharedOrganization;
      'shared.payment-methods': SharedPaymentMethods;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.shipping-zone-breakpoints': SharedShippingZoneBreakpoints;
      'shared.slider': SharedSlider;
      'shared.social-links': SharedSocialLinks;
      'shared.social-meta': SharedSocialMeta;
      'shared.testimonial-section': SharedTestimonialSection;
    }
  }
}
