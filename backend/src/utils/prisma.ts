import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

type UserRole = 'CUSTOMER' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
type CareLevel = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXPERT';
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO' | 'STRIPE' | 'PAYPAL';

export interface LocalUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  categoryId: string;
  images: string[];
  speciesName?: string | null;
  size?: string | null;
  lifespan?: string | null;
  waterTemperature?: string | null;
  phLevel?: string | null;
  foodType?: string | null;
  careLevel?: CareLevel | null;
  compatibility?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  soldCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  images: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export interface LocalOrder {
  id: string;
  userId: string;
  orderCode: string;
  fullName: string;
  phone: string;
  address: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  note?: string;
  couponCode?: string;
  items: LocalOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface LocalBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  status: 'DRAFT' | 'PUBLISHED';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface LocalDatabase {
  users: LocalUser[];
  categories: LocalCategory[];
  products: LocalProduct[];
  reviews: LocalReview[];
  orders: LocalOrder[];
  coupons: LocalCoupon[];
  blogPosts: LocalBlogPost[];
}

const dbPath = path.join(process.cwd(), 'data', 'local-db.json');
const isoNow = () => new Date().toISOString();

const product = (
  slug: string,
  name: string,
  categoryId: string,
  price: number,
  stock: number,
  image: string,
  extra: Partial<LocalProduct> = {}
): LocalProduct => ({
  id: slug,
  name,
  slug,
  description: `${name} khỏe mạnh, màu đẹp, phù hợp cho hồ cá cảnh gia đình và cửa hàng thủy sinh.`,
  price,
  salePrice: null,
  stock,
  categoryId,
  images: [image],
  speciesName: null,
  size: null,
  lifespan: null,
  waterTemperature: null,
  phLevel: null,
  foodType: 'Ăn tạp',
  careLevel: 'EASY',
  compatibility: 'Nuôi cộng đồng',
  isFeatured: false,
  isActive: true,
  soldCount: Math.floor(Math.random() * 120) + 5,
  viewCount: Math.floor(Math.random() * 800) + 30,
  createdAt: isoNow(),
  updatedAt: isoNow(),
  ...extra,
});

const category = (
  id: string,
  name: string,
  description: string,
  image: string
): LocalCategory => ({
  id,
  slug: id,
  name,
  description,
  image,
  parentId: null,
  createdAt: isoNow(),
  updatedAt: isoNow(),
});

function createInitialDatabase(): LocalDatabase {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const customerPassword = bcrypt.hashSync('customer123', 10);

  const users: LocalUser[] = [
    {
      id: 'user-admin',
      email: 'admin@aquafish.com',
      passwordHash: adminPassword,
      fullName: 'Admin AquaFish',
      phone: '0901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: isoNow(),
      updatedAt: isoNow(),
    },
    {
      id: 'user-customer',
      email: 'customer@example.com',
      passwordHash: customerPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: isoNow(),
      updatedAt: isoNow(),
    },
  ];

  const categories = [
    category('ca-neon', 'Cá Neon', 'Các dòng neon nhỏ, bơi đàn đẹp và rất hợp hồ thủy sinh.', '/picture/neon/bongxanhneon.webp'),
    category('ca-chuot', 'Cá Chuột', 'Cá tầng đáy hiền lành, hỗ trợ dọn thức ăn thừa trong bể.', '/picture/cachuot/16-ca-chuot-xanh.jpg'),
    category('combo-ca', 'Combo Cá & Tép', 'Combo tiết kiệm cho người mới bắt đầu setup bể.', '/picture/comboca/02-combo-ca-neon-vua.jpg'),
    category('ca-canh-tong-hop', 'Cá Cảnh Tổng Hợp', 'Cá dĩa, phượng hoàng, thần tiên, tép cảnh và nhiều dòng nổi bật.', '/picture/catonghop/21-ca-dia-do-trang.jpg'),
    category('be-kinh', 'Bể Kính', 'Bể kính nhiều kích thước, phù hợp bàn làm việc đến phòng khách.', '/picture/bekinh/be1.jfif'),
    category('thuc-an-ca', 'Thức Ăn Cá', 'Thức ăn chuyên dụng giúp cá khỏe, lên màu và phát triển ổn định.', '/picture/thucan/betta.webp'),
  ];

  const products: LocalProduct[] = [
    product('ca-neon-xanh', 'Cá Neon Xanh', 'ca-neon', 8000, 300, '/picture/neon/bongxanhneon.webp', {
      isFeatured: true,
      speciesName: 'Paracheirodon innesi',
      size: '3-4cm',
      lifespan: '5-8 năm',
      waterTemperature: '20-26°C',
      phLevel: '6.0-7.0',
    }),
    product('ca-neon-do', 'Cá Neon Đỏ', 'ca-neon', 10000, 250, '/picture/neon/redneon.webp', {
      isFeatured: true,
      speciesName: 'Paracheirodon axelrodi',
      waterTemperature: '23-27°C',
      phLevel: '5.5-7.0',
    }),
    product('ca-neon-bung-do', 'Cá Neon Bụng Đỏ', 'ca-neon', 9000, 200, '/picture/neon/caneonbungdo.webp'),
    product('ca-cardinal-tetra', 'Cá Cardinal Tetra', 'ca-neon', 12000, 180, '/picture/neon/cardinaltetrabred.webp'),
    product('ca-gold-tetra', 'Cá Gold Tetra', 'ca-neon', 15000, 150, '/picture/neon/goldtetra.webp'),
    product('ca-black-neon-tetra', 'Cá Black Neon Tetra', 'ca-neon', 11000, 200, '/picture/neon/blackneontera.webp'),

    product('ca-chuot-xanh', 'Cá Chuột Xanh', 'ca-chuot', 25000, 100, '/picture/cachuot/16-ca-chuot-xanh.jpg', { isFeatured: true }),
    product('ca-chuot-anh-xanh', 'Cá Chuột Anh Xanh', 'ca-chuot', 30000, 80, '/picture/cachuot/17-ca-chuot-anh-xanh.jpg'),
    product('ca-chuot-zebra', 'Cá Chuột Zebra', 'ca-chuot', 28000, 90, '/picture/cachuot/18-ca-chuot-zebra.jpg'),
    product('ca-chuot-bach-tang', 'Cá Chuột Bạch Tạng', 'ca-chuot', 35000, 70, '/picture/cachuot/19-ca-chuot-bach-tang.jpg'),
    product('ca-chuot-julii', 'Cá Chuột Julii', 'ca-chuot', 32000, 75, '/picture/cachuot/20-ca-chuot-julii.jpg'),

    product('combo-ca-neon-vua', 'Combo Cá Neon Vua', 'combo-ca', 150000, 50, '/picture/comboca/02-combo-ca-neon-vua.jpg', {
      salePrice: 120000,
      isFeatured: true,
      description: 'Combo 10 cá neon khỏe, lên màu đẹp, thích hợp thả đàn trong bể thủy sinh.',
    }),
    product('combo-ca-neon-xanh', 'Combo Cá Neon Xanh', 'combo-ca', 140000, 60, '/picture/comboca/03-combo-ca-neon-xanh.jpg', {
      salePrice: 110000,
      isFeatured: true,
    }),
    product('combo-tep-rilli-do', 'Combo Tép Rilli Đỏ', 'combo-ca', 180000, 40, '/picture/comboca/13-combo-tep-rilli-do.jpg', {
      salePrice: 150000,
    }),
    product('combo-tep-rilli-vang', 'Combo Tép Rilli Vàng', 'combo-ca', 200000, 35, '/picture/comboca/14-combo-tep-rilli-vang.jpg', {
      salePrice: 170000,
    }),
    product('combo-tep-nhieu-mau', 'Combo Tép Nhiều Màu', 'combo-ca', 220000, 35, '/picture/comboca/15-combo-tep-nhieu-mau.jpg', {
      salePrice: 189000,
    }),

    product('ca-dia-do-trang', 'Cá Dĩa Đỏ Trắng', 'ca-canh-tong-hop', 350000, 25, '/picture/catonghop/21-ca-dia-do-trang.jpg', {
      salePrice: 300000,
      isFeatured: true,
      careLevel: 'MODERATE',
      size: '12-15cm',
      waterTemperature: '26-30°C',
    }),
    product('ca-dia-do', 'Cá Dĩa Đỏ', 'ca-canh-tong-hop', 320000, 30, '/picture/catonghop/24-ca-dia-do.jpg', {
      isFeatured: true,
      careLevel: 'MODERATE',
    }),
    product('ca-dia-xanh-hoa-van', 'Cá Dĩa Xanh Hoa Văn', 'ca-canh-tong-hop', 380000, 20, '/picture/catonghop/26-ca-dia-xanh-hoa-van.jpg', {
      careLevel: 'MODERATE',
    }),
    product('ca-phuong-hoang-lua', 'Cá Phượng Hoàng Lửa', 'ca-canh-tong-hop', 180000, 40, '/picture/catonghop/34-ca-phuong-hoang-lua.jpg', {
      salePrice: 150000,
      isFeatured: true,
    }),
    product('ca-phuong-hoang-xanh', 'Cá Phượng Hoàng Xanh', 'ca-canh-tong-hop', 200000, 35, '/picture/catonghop/36-ca-phuong-hoang-xanh.jpg'),
    product('tep-cherry-do', 'Tép Cherry Đỏ', 'ca-canh-tong-hop', 15000, 200, '/picture/catonghop/43-tep-cherry-do.jpg'),
    product('tep-blue-dream', 'Tép Blue Dream', 'ca-canh-tong-hop', 25000, 150, '/picture/catonghop/44-tep-blue-dream.jpg'),
    product('ca-than-tien-vay-dai', 'Cá Thần Tiên Vây Dài', 'ca-canh-tong-hop', 250000, 30, '/picture/catonghop/51-ca-than-tien-vay-dai.jpg', {
      salePrice: 220000,
      isFeatured: true,
      careLevel: 'MODERATE',
    }),

    product('be-kinh-30cm', 'Bể Kính 30cm', 'be-kinh', 180000, 50, '/picture/bekinh/be1.jfif', {
      description: 'Bể kính 30x20x25cm, phù hợp nuôi cá nhỏ hoặc đặt bàn làm việc.',
      careLevel: null,
      foodType: null,
    }),
    product('be-kinh-40cm', 'Bể Kính 40cm', 'be-kinh', 280000, 40, '/picture/bekinh/be2.jfif', { isFeatured: true, careLevel: null, foodType: null }),
    product('be-kinh-50cm', 'Bể Kính 50cm', 'be-kinh', 380000, 35, '/picture/bekinh/be3.jfif', { salePrice: 350000, careLevel: null, foodType: null }),
    product('be-kinh-60cm', 'Bể Kính 60cm', 'be-kinh', 550000, 30, '/picture/bekinh/be4.jfif', { salePrice: 500000, isFeatured: true, careLevel: null, foodType: null }),
    product('be-kinh-80cm', 'Bể Kính 80cm', 'be-kinh', 850000, 20, '/picture/bekinh/be5.jfif', { salePrice: 780000, isFeatured: true, careLevel: null, foodType: null }),

    product('thuc-an-betta', 'Thức Ăn Betta', 'thuc-an-ca', 45000, 100, '/picture/thucan/betta.webp', { isFeatured: true, careLevel: null }),
    product('thuc-an-neon', 'Thức Ăn Neon', 'thuc-an-ca', 35000, 120, '/picture/thucan/neon.webp', { isFeatured: true, careLevel: null }),
    product('thuc-an-cadia', 'Thức Ăn Cadia', 'thuc-an-ca', 55000, 90, '/picture/thucan/cadia.webp', { careLevel: null }),
    product('thuc-an-ali', 'Thức Ăn Ali', 'thuc-an-ca', 40000, 110, '/picture/thucan/ali.webp', { careLevel: null }),
  ];

  const reviews: LocalReview[] = [
    review('user-customer', 'ca-neon-xanh', 5, 'Cá khỏe, thả vào bể bơi đàn rất đẹp.'),
    review('user-admin', 'ca-neon-xanh', 5, 'Màu xanh sáng, hợp hồ thủy sinh nhỏ.'),
    review('user-customer', 'ca-chuot-xanh', 5, 'Cá chuột siêng dọn đáy, rất đáng mua.'),
    review('user-customer', 'combo-ca-neon-vua', 4, 'Combo tiết kiệm, cá về đủ số lượng.'),
    review('user-customer', 'ca-dia-do-trang', 5, 'Cá dĩa lên màu tốt, đóng gói cẩn thận.'),
  ];

  return {
    users,
    categories,
    products,
    reviews,
    orders: createSeedOrders(products),
    coupons: [
      {
        code: 'WELCOME2026',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 300000,
        maxDiscount: 100000,
        usageLimit: 100,
        usedCount: 0,
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-12-31T23:59:59.000Z',
        isActive: true,
      },
      {
        code: 'FREESHIP',
        discountType: 'FIXED_AMOUNT',
        discountValue: 30000,
        minOrderValue: 500000,
        usageLimit: 50,
        usedCount: 0,
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-12-31T23:59:59.000Z',
        isActive: true,
      },
    ],
    blogPosts: [
      blog('huong-dan-nuoi-ca-neon', 'Hướng Dẫn Nuôi Cá Neon Cho Người Mới', '/picture/neon/bongxanhneon.webp'),
      blog('top-ca-canh-de-nuoi', 'Top Cá Cảnh Dễ Nuôi Cho Hồ Gia Đình', '/picture/comboca/02-combo-ca-neon-vua.jpg'),
      blog('chon-be-kinh-phu-hop', 'Cách Chọn Bể Kính Phù Hợp Không Gian', '/picture/bekinh/be4.jfif'),
    ],
  };
}

function review(userId: string, productId: string, rating: number, comment: string): LocalReview {
  return {
    id: randomUUID(),
    userId,
    productId,
    rating,
    comment,
    images: [],
    isVisible: true,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
}

function blog(slug: string, title: string, coverImage: string): LocalBlogPost {
  return {
    id: slug,
    slug,
    title,
    excerpt: 'Kiến thức chăm sóc cá cảnh, lựa chọn thiết bị và vận hành hồ thủy sinh ổn định.',
    content: 'AquaFish chia sẻ kinh nghiệm thực tế để bạn chăm cá khỏe, nước trong và bố cục bể đẹp hơn mỗi ngày.',
    coverImage,
    authorId: 'user-admin',
    status: 'PUBLISHED',
    viewCount: 0,
    createdAt: isoNow(),
    updatedAt: isoNow(),
    publishedAt: isoNow(),
  };
}

function createSeedOrders(products: LocalProduct[]): LocalOrder[] {
  const neon = products.find((item) => item.id === 'combo-ca-neon-vua')!;
  const food = products.find((item) => item.id === 'thuc-an-neon')!;

  return [
    {
      id: 'order-demo-1',
      userId: 'user-customer',
      orderCode: 'AQF0001',
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      subtotal: (neon.salePrice || neon.price) + food.price,
      shippingFee: 30000,
      discount: 0,
      total: (neon.salePrice || neon.price) + food.price + 30000,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'SHIPPING',
      note: 'Giao giờ hành chính',
      items: [
        {
          id: randomUUID(),
          productId: neon.id,
          productName: neon.name,
          productImage: neon.images[0],
          quantity: 1,
          price: neon.salePrice || neon.price,
        },
        {
          id: randomUUID(),
          productId: food.id,
          productName: food.name,
          productImage: food.images[0],
          quantity: 1,
          price: food.price,
        },
      ],
      createdAt: isoNow(),
      updatedAt: isoNow(),
    },
  ];
}

function loadDatabase(): LocalDatabase {
  if (!fs.existsSync(dbPath)) {
    const initial = createInitialDatabase();
    saveDatabase(initial);
    return initial;
  }

  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8')) as LocalDatabase;
    if (!data.users || !data.products || !data.categories) {
      throw new Error('Invalid local database shape');
    }
    return data;
  } catch {
    const initial = createInitialDatabase();
    saveDatabase(initial);
    return initial;
  }
}

function saveDatabase(nextDb: LocalDatabase) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(nextDb, null, 2), 'utf8');
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const db = loadDatabase();

function selectFields<T extends Record<string, any>>(record: T | null | undefined, select?: Record<string, any>) {
  if (!record || !select) return record ? clone(record) : record;

  const selected: Record<string, any> = {};
  Object.entries(select).forEach(([key, enabled]) => {
    if (enabled) selected[key] = record[key];
  });
  return selected;
}

function applyOrder<T extends Record<string, any>>(items: T[], orderBy?: Record<string, 'asc' | 'desc'>) {
  if (!orderBy) return items;
  const [key, direction] = Object.entries(orderBy)[0] || [];
  if (!key) return items;

  return [...items].sort((a, b) => {
    const left = a[key];
    const right = b[key];
    if (left === right) return 0;
    const result = left > right ? 1 : -1;
    return direction === 'desc' ? -result : result;
  });
}

function matchesWhere(record: Record<string, any>, where?: Record<string, any>): boolean {
  if (!where) return true;

  return Object.entries(where).every(([key, condition]) => {
    if (key === 'OR' && Array.isArray(condition)) {
      return condition.some((item) => matchesWhere(record, item));
    }

    if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
      if ('contains' in condition) {
        const value = String(record[key] || '').toLowerCase();
        return value.includes(String(condition.contains).toLowerCase());
      }
      if ('not' in condition) {
        return record[key] !== condition.not;
      }
      if ('gte' in condition && Number(record[key]) < Number(condition.gte)) {
        return false;
      }
      if ('lte' in condition && Number(record[key]) > Number(condition.lte)) {
        return false;
      }
      return true;
    }

    return record[key] === condition;
  });
}

function withCategoryInclude(categoryData: LocalCategory, args: any = {}) {
  const result: any = clone(categoryData);
  const include = args.include || {};

  if (include.parent) {
    const parent = db.categories.find((item) => item.id === categoryData.parentId);
    result.parent = selectFields(parent, include.parent.select);
  }

  if (include.children) {
    const children = db.categories.filter((item) => item.parentId === categoryData.id);
    result.children = children.map((item) => selectFields(item, include.children.select));
  }

  if (include._count) {
    result._count = {
      products: db.products.filter((item) => item.categoryId === categoryData.id).length,
    };
  }

  return args.select ? selectFields(result, args.select) : result;
}

function withProductInclude(productData: LocalProduct, args: any = {}) {
  const result: any = clone(productData);
  const include = args.include || {};

  if (include.category) {
    const foundCategory = db.categories.find((item) => item.id === productData.categoryId);
    result.category = selectFields(foundCategory, include.category.select);
  }

  if (include.reviews) {
    let reviews = db.reviews.filter((item) => item.productId === productData.id);
    if (include.reviews.where?.isVisible !== undefined) {
      reviews = reviews.filter((item) => item.isVisible === include.reviews.where.isVisible);
    }
    reviews = applyOrder(reviews, include.reviews.orderBy);

    result.reviews = reviews.map((item) => {
      const reviewData: any = clone(item);
      if (include.reviews.include?.user) {
        const foundUser = db.users.find((user) => user.id === item.userId);
        reviewData.user = selectFields(foundUser, include.reviews.include.user.select);
      }
      return include.reviews.select ? selectFields(reviewData, include.reviews.select) : reviewData;
    });
  }

  return args.select ? selectFields(result, args.select) : result;
}

function persist() {
  saveDatabase(db);
}

export const localStore = {
  db,

  getDashboardStats() {
    const revenue = db.orders.reduce((sum, order) => sum + order.total, 0);
    return {
      totalRevenue: revenue,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      totalUsers: db.users.length,
      recentOrders: applyOrder(db.orders, { createdAt: 'desc' }).slice(0, 5),
    };
  },

  listOrders(userId?: string, isAdmin = false) {
    const orders = isAdmin ? db.orders : db.orders.filter((order) => order.userId === userId);
    return applyOrder(orders, { createdAt: 'desc' }).map(clone);
  },

  createOrder(input: {
    userId: string;
    fullName: string;
    phone: string;
    address: string;
    paymentMethod: PaymentMethod;
    note?: string;
    couponCode?: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    const orderItems = input.items.map((item) => {
      const foundProduct = db.products.find((productItem) => productItem.id === item.productId);
      if (!foundProduct) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (foundProduct.stock < item.quantity) {
        throw new Error(`${foundProduct.name} không đủ hàng`);
      }

      const price = foundProduct.salePrice || foundProduct.price;
      return {
        id: randomUUID(),
        productId: foundProduct.id,
        productName: foundProduct.name,
        productImage: foundProduct.images[0],
        quantity: item.quantity,
        price,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    let discount = 0;
    const coupon = input.couponCode ? this.validateCoupon(input.couponCode, subtotal) : null;
    if (coupon?.valid) {
      discount = coupon.discount;
    }

    const order: LocalOrder = {
      id: randomUUID(),
      userId: input.userId,
      orderCode: `AQF${String(db.orders.length + 1).padStart(4, '0')}`,
      fullName: input.fullName,
      phone: input.phone,
      address: input.address,
      subtotal,
      shippingFee,
      discount,
      total: Math.max(0, subtotal + shippingFee - discount),
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      note: input.note,
      couponCode: input.couponCode,
      items: orderItems,
      createdAt: isoNow(),
      updatedAt: isoNow(),
    };

    orderItems.forEach((item) => {
      const foundProduct = db.products.find((productItem) => productItem.id === item.productId);
      if (foundProduct) {
        foundProduct.stock -= item.quantity;
        foundProduct.soldCount += item.quantity;
        foundProduct.updatedAt = isoNow();
      }
    });

    if (coupon?.valid && input.couponCode) {
      const foundCoupon = db.coupons.find((item) => item.code === input.couponCode?.toUpperCase());
      if (foundCoupon) foundCoupon.usedCount += 1;
    }

    db.orders.push(order);
    persist();
    return clone(order);
  },

  validateCoupon(code?: string, subtotal = 0) {
    if (!code) return { valid: false, discount: 0, message: 'Mã giảm giá không hợp lệ' };
    const coupon = db.coupons.find((item) => item.code === code.toUpperCase());
    const now = new Date();

    if (!coupon || !coupon.isActive) {
      return { valid: false, discount: 0, message: 'Mã giảm giá không tồn tại' };
    }
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return { valid: false, discount: 0, message: 'Mã giảm giá đã hết hạn' };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Mã giảm giá đã hết lượt dùng' };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ`,
      };
    }

    const rawDiscount =
      coupon.discountType === 'PERCENTAGE'
        ? subtotal * (coupon.discountValue / 100)
        : coupon.discountValue;
    const discount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);
    return { valid: true, discount, message: 'Áp dụng mã giảm giá thành công', coupon: clone(coupon) };
  },
};

const prisma = {
  user: {
    async findUnique(args: any) {
      const where = args?.where || {};
      const found = db.users.find((item) =>
        where.email ? item.email === where.email : item.id === where.id
      );
      return selectFields(found, args?.select);
    },
    async create(args: any) {
      const nextUser: LocalUser = {
        id: randomUUID(),
        email: args.data.email,
        passwordHash: args.data.passwordHash,
        fullName: args.data.fullName,
        phone: args.data.phone,
        avatar: args.data.avatar,
        role: args.data.role || 'CUSTOMER',
        status: args.data.status || 'ACTIVE',
        createdAt: isoNow(),
        updatedAt: isoNow(),
      };
      db.users.push(nextUser);
      persist();
      return selectFields(nextUser, args?.select);
    },
    async update(args: any) {
      const index = db.users.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('User not found');
      db.users[index] = { ...db.users[index], ...args.data, updatedAt: isoNow() };
      persist();
      return selectFields(db.users[index], args?.select);
    },
  },

  category: {
    async findMany(args: any = {}) {
      const categories = applyOrder(db.categories.filter((item) => matchesWhere(item, args.where)), args.orderBy);
      return categories.map((item) => withCategoryInclude(item, args));
    },
    async count(args: any = {}) {
      return db.categories.filter((item) => matchesWhere(item, args.where)).length;
    },
    async findFirst(args: any) {
      const found = db.categories.find((item) => matchesWhere(item, args?.where));
      return found ? withCategoryInclude(found, args) : null;
    },
    async findUnique(args: any) {
      const where = args?.where || {};
      const found = db.categories.find((item) =>
        where.slug ? item.slug === where.slug : item.id === where.id
      );
      return found ? withCategoryInclude(found, args) : null;
    },
    async create(args: any) {
      const nextCategory: LocalCategory = {
        id: args.data.id || args.data.slug || randomUUID(),
        slug: args.data.slug,
        name: args.data.name,
        description: args.data.description,
        image: args.data.image,
        parentId: args.data.parentId || null,
        createdAt: isoNow(),
        updatedAt: isoNow(),
      };
      db.categories.push(nextCategory);
      persist();
      return withCategoryInclude(nextCategory, args);
    },
    async update(args: any) {
      const index = db.categories.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('Category not found');
      db.categories[index] = { ...db.categories[index], ...args.data, updatedAt: isoNow() };
      persist();
      return withCategoryInclude(db.categories[index], args);
    },
    async delete(args: any) {
      const index = db.categories.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('Category not found');
      const [deleted] = db.categories.splice(index, 1);
      persist();
      return clone(deleted);
    },
  },

  product: {
    async findMany(args: any = {}) {
      let products = db.products.filter((item) => matchesWhere(item, args.where));
      products = applyOrder(products, args.orderBy);
      if (typeof args.skip === 'number') products = products.slice(args.skip);
      if (typeof args.take === 'number') products = products.slice(0, args.take);
      return products.map((item) => withProductInclude(item, args));
    },
    async count(args: any = {}) {
      return db.products.filter((item) => matchesWhere(item, args.where)).length;
    },
    async findFirst(args: any) {
      const found = db.products.find((item) => matchesWhere(item, args?.where));
      return found ? withProductInclude(found, args) : null;
    },
    async findUnique(args: any) {
      const where = args?.where || {};
      const found = db.products.find((item) =>
        where.slug ? item.slug === where.slug : item.id === where.id
      );
      return found ? withProductInclude(found, args) : null;
    },
    async create(args: any) {
      const nextProduct: LocalProduct = {
        id: args.data.id || args.data.slug || randomUUID(),
        soldCount: 0,
        viewCount: 0,
        createdAt: isoNow(),
        updatedAt: isoNow(),
        isFeatured: false,
        isActive: true,
        stock: 0,
        images: [],
        ...args.data,
      };
      db.products.push(nextProduct);
      persist();
      return withProductInclude(nextProduct, args);
    },
    async update(args: any) {
      const index = db.products.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('Product not found');
      const data = { ...args.data };
      if (data.viewCount?.increment) {
        data.viewCount = db.products[index].viewCount + data.viewCount.increment;
      }
      db.products[index] = { ...db.products[index], ...data, updatedAt: isoNow() };
      persist();
      return withProductInclude(db.products[index], args);
    },
    async delete(args: any) {
      const index = db.products.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('Product not found');
      const [deleted] = db.products.splice(index, 1);
      persist();
      return clone(deleted);
    },
  },

  $disconnect: async () => undefined,
};

export default prisma;
