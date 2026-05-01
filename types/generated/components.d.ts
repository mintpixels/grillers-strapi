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
    displayName: 'HeaderNav';
  };
  attributes: {
    Children: Schema.Attribute.Component<'common.link', true>;
    Link: Schema.Attribute.Component<'common.link', false>;
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
    ProductId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
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
    Sku: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    VariantId: Schema.Attribute.String;
  };
}

export interface PdpProductMetadata extends Struct.ComponentSchema {
  collectionName: 'components_pdp_product_metadata';
  info: {
    displayName: 'ProductMetadata';
  };
  attributes: {
    AvgPackSize: Schema.Attribute.String;
    AvgPackWeight: Schema.Attribute.String;
    Cooked: Schema.Attribute.Boolean;
    GlutenFree: Schema.Attribute.Boolean;
    PiecesPerPack: Schema.Attribute.Integer;
    Serves: Schema.Attribute.String;
    Uncooked: Schema.Attribute.Boolean;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'checkout.plant-pickup-date': CheckoutPlantPickupDate;
      'checkout.shipping-blackout-dates': CheckoutShippingBlackoutDates;
      'common.collection-card': CommonCollectionCard;
      'common.faq-item': CommonFaqItem;
      'common.header-nav': CommonHeaderNav;
      'common.how-it-works-card': CommonHowItWorksCard;
      'common.link': CommonLink;
      'common.product-card': CommonProductCard;
      'common.why-us-list': CommonWhyUsList;
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
      'pdp.how-it-works': PdpHowItWorks;
      'pdp.medusa-price': PdpMedusaPrice;
      'pdp.medusa-product': PdpMedusaProduct;
      'pdp.medusa-variants': PdpMedusaVariants;
      'pdp.product-metadata': PdpProductMetadata;
      'pdp.sategorization': PdpSategorization;
      'pdp.why-us': PdpWhyUs;
      'recipe.ingredient': RecipeIngredient;
      'recipe.step': RecipeStep;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.shipping-zone-breakpoints': SharedShippingZoneBreakpoints;
      'shared.slider': SharedSlider;
      'shared.social-meta': SharedSocialMeta;
    }
  }
}
