import type { Schema, Struct } from '@strapi/strapi';

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
    Aisle: Schema.Attribute.Relation<'oneToOne', 'api::aisle.aisle'>;
    Category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    MasterCategory: Schema.Attribute.Relation<
      'oneToOne',
      'api::master-category.master-category'
    >;
    ProductCollections: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-collection.product-collection'
    >;
    ProductTags: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-tag.product-tag'
    >;
    ProductType: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-type.product-type'
    >;
    SubCategory: Schema.Attribute.Relation<
      'oneToOne',
      'api::sub-category.sub-category'
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
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.collection-card': CommonCollectionCard;
      'common.how-it-works-card': CommonHowItWorksCard;
      'common.link': CommonLink;
      'common.product-card': CommonProductCard;
      'common.why-us-list': CommonWhyUsList;
      'home.bestsellers': HomeBestsellers;
      'home.blog-explore': HomeBlogExplore;
      'home.follow-us': HomeFollowUs;
      'home.hero': HomeHero;
      'home.kosher-promise': HomeKosherPromise;
      'home.shop-collections': HomeShopCollections;
      'home.testimonial': HomeTestimonial;
      'pdp.how-it-works': PdpHowItWorks;
      'pdp.product-metadata': PdpProductMetadata;
      'pdp.sategorization': PdpSategorization;
      'pdp.why-us': PdpWhyUs;
      'recipe.ingredient': RecipeIngredient;
      'recipe.step': RecipeStep;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
