import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Assignment Sequence (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let productId: string;
    let campaignId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 0. Register and login to get JWT (assuming registration works)
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ username: 'admin', password: 'password123' });

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin', password: 'password123' });
        
        token = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('Step 1-6: POST /api/products (URL/SKU) -> Save Product & Initial Offer', async () => {
        const productRes = await request(app.getHttpServer())
            .post('/api/products') // Now matches diagram
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'iPhone 15 Pro',
                imageUrl: 'https://example.com/iphone15.jpg',
                lazadaUrl: 'https://www.lazada.co.th/products/iphone15'
            })
            .expect(201);

        expect(productRes.body).toHaveProperty('id');
        expect(productRes.body.title).toBe('iPhone 15 Pro');
        expect(productRes.body.offers).toBeDefined();
        expect(productRes.body.offers.length).toBeGreaterThan(0);
        productId = productRes.body.id;
    });

    it('Step 7: POST /api/campaigns', async () => {
        const campaignRes = await request(app.getHttpServer())
            .post('/api/campaigns') // Now matches diagram
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Summer Sale 2026',
                utmCampaign: 'summer_sale_26',
                startAt: new Date(),
                endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days from now
            })
            .expect(201);

        expect(campaignRes.body).toHaveProperty('id');
        expect(campaignRes.body.name).toBe('Summer Sale 2026');
        campaignId = campaignRes.body.id;
    });

    it('Step 8-9: POST /api/links (Generate Affiliate Link) -> Store Link with short code', async () => {
        const linkRes = await request(app.getHttpServer())
            .post('/api/links') // This one HAS /api in the controller's @Post
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: productId,
                campaignId: campaignId,
                targetUrl: 'https://example.com/iphone15-special'
            })
            .expect(201);

        expect(linkRes.body).toHaveProperty('id');
        expect(linkRes.body).toHaveProperty('shortCode');
        expect(linkRes.body.shortCode.length).toBe(6);
    });
});
