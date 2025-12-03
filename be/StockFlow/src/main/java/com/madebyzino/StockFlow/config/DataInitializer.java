package com.madebyzino.StockFlow.config;

import com.madebyzino.StockFlow.dto.auth.RegisterRequest;
import com.madebyzino.StockFlow.entity.Category;
import com.madebyzino.StockFlow.entity.Inventory;
import com.madebyzino.StockFlow.entity.Item;
import com.madebyzino.StockFlow.entity.Location;
import com.madebyzino.StockFlow.entity.user.User;
import com.madebyzino.StockFlow.entity.user.UserRole;
import com.madebyzino.StockFlow.repository.CategoryRepository;
import com.madebyzino.StockFlow.repository.InventoryRepository;
import com.madebyzino.StockFlow.repository.ItemRepository;
import com.madebyzino.StockFlow.repository.LocationRepository;
import com.madebyzino.StockFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ItemRepository itemRepository;
    private final InventoryRepository inventoryRepository;


    private static final int MIN_PRICE = 1000;
    private static final int MAX_PRICE = 50000;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // 1. 초기 관리자 계정 생성 (기존 로직)
        if (userRepository.findByUsername("admin").isEmpty()) {
            RegisterRequest adminRequest = new RegisterRequest();
            adminRequest.setUsername("admin");
            adminRequest.setPassword("password12");

            String encodedPassword = passwordEncoder.encode(adminRequest.getPassword());

            User adminUser = User.builder()
                    .username(adminRequest.getUsername())
                    .password(encodedPassword)
                    .role(UserRole.MANAGER)
                    .build();

            userRepository.save(adminUser);
        }

        // 2. 초기 카테고리 60개 생성 (기존 로직)
        if (categoryRepository.count() == 0) {
            List<String> realCategories = Arrays.asList(
                    "노트북", "데스크탑 PC", "모니터", "키보드 및 마우스", "네트워크 장비", "서버 부품", "프린터 및 복합기", "프로젝터", "보안 카메라", "태블릿 PC",
                    "잉크/토너 카트리지", "USB 메모리", "외장 하드디스크", "케이블 및 어댑터", "배터리", "CD/DVD 미디어", "헤드셋/이어폰", "마우스패드", "정전기 방지용품", "소프트웨어 라이선스",
                    "A4 용지", "파일 및 바인더", "펜/연필", "포스트잇", "테이프/풀", "가위/커터칼", "스테이플러", "클립/집게", "계산기", "달력/다이어리",
                    "박스 포장재", "에어캡/완충재", "포장용 테이프", "라벨 프린터 용지", "바코드 스캐너", "지게차 부품", "안전모/보안경", "안전 장갑", "운반용 팔레트", "수동 핸드카트",
                    "드라이버 세트", "렌치 세트", "전기 드릴", "측정 도구", "윤활유/방청제", "청소 용품", "보수용 페인트", "소형 발전기", "접착제/실리콘", "전기 부품",
                    "세척제", "손 소독제", "구급 상자 내용물", "휴지/타월", "생수", "커피/차", "개인 위생용품", "의자/책상", "카페트/매트", "장식용품"
            );

            List<Category> categories = new ArrayList<>();

            IntStream.range(0, realCategories.size()).forEach(index -> {
                String name = realCategories.get(index);
                String code = generateSequentialCode(index);

                Category category = Category.builder()
                        .name(name)
                        .description(name + " 관련 물품 분류")
                        .code(code)
                        .build();
                categories.add(category);
            });

            categoryRepository.saveAll(categories);
            System.out.println("--- 60개의 카테고리 데이터가 성공적으로 초기화되었습니다. ---");
        }

        // 카테고리 목록을 메모리에 로드
        List<Category> allCategories = categoryRepository.findAll();
        Random random = new Random();

        // 3. 초기 위치 데이터 800개 생성 (Location)
        if (locationRepository.count() == 0) {
            List<Location> locations = new ArrayList<>();
            List<String> centerNames = Arrays.asList("1센터", "2센터", "3센터", "4센터");
            List<String> zones = Arrays.asList("A", "B", "C", "D", "E", "F");

            // 총 4개 센터 * 6개 구역 * 200개 선반 = 4800개 가능성 중 800개 선택
            IntStream.range(1, 201).forEach(binNum -> {
                for (String center : centerNames) {
                    for (String zone : zones) {
                        String binCode = String.format("%s-%s-%03d", center.substring(0, 1), zone, binNum);

                        if (locations.size() < 800) {
                            String uniqueBinCode = String.format("%s-%s-%04d",
                                    center.substring(0,1),
                                    zone,
                                    locations.size() + 1);

                            Location location = Location.builder()
                                    .centerName(center)
                                    .zone(zone)
                                    .binCode(uniqueBinCode)
                                    .isActive(true)
                                    .build();
                            locations.add(location);
                        }
                    }
                }
            });

            List<Location> actualLocations = new ArrayList<>();
            int locationCount = 0;
            for (String center : centerNames) {
                for (String zone : zones) {
                    for (int binNum = 1; binNum <= 33; binNum++) {
                        if (locationCount >= 800) break;

                        String uniqueBinCode = String.format("%s%s-%03d",
                                center.substring(0,1),
                                zone,
                                binNum);

                        Location location = Location.builder()
                                .centerName(center)
                                .zone(zone)
                                .binCode(uniqueBinCode)
                                .isActive(locationCount % 10 != 0)
                                .build();
                        actualLocations.add(location);
                        locationCount++;
                    }
                    if (locationCount >= 800) break;
                }
                if (locationCount >= 800) break;
            }

            locationRepository.saveAll(actualLocations);
            System.out.println("--- " + actualLocations.size() + "개의 위치(Location) 데이터가 성공적으로 초기화되었습니다. ---");
        }

        List<Location> allLocations = locationRepository.findAll();

        if (itemRepository.count() == 0 && !allCategories.isEmpty()) {
            List<Item> items = new ArrayList<>();
            IntStream.range(1, 1001).forEach(i -> {
                Category category = allCategories.get(random.nextInt(allCategories.size()));
                int randomPrice = generateRandomPrice();
                Item item = Item.builder()
                        .name(category.getName() + " 제품 " + i)
                        .sku(category.getCode()+i)
                        .safetyStock(random.nextInt(5) * 10) // 0, 10, 20, 30, 40 (안전재고)
                        .price(randomPrice)
                        .category(category)
                        .build();
                items.add(item);
            });
            itemRepository.saveAll(items);
            System.out.println("--- 1000개의 아이템(Item) 데이터가 성공적으로 초기화되었습니다. ---");
        }

        List<Item> allItems = itemRepository.findAll();

        if (inventoryRepository.count() == 0 && !allLocations.isEmpty() && !allItems.isEmpty()) {
            List<Inventory> inventories = new ArrayList<>();

            int itemsToStockCount = (int) (allItems.size() * 0.8);

            for (int i = 0; i < itemsToStockCount; i++) {
                Item item = allItems.get(i);

                int numberOfLocations = random.nextInt(3) + 1;
                List<Location> locationsForItem = new ArrayList<>();

                while (locationsForItem.size() < numberOfLocations) {
                    Location location = allLocations.get(random.nextInt(allLocations.size()));
                    if (!locationsForItem.contains(location)) {
                        locationsForItem.add(location);
                    }
                }

                for (Location location : locationsForItem) {
                    // 수량: 10 ~ 1000개 사이의 임의 수량
                    int quantity = random.nextInt(991) + 10;

                    Inventory inventory = Inventory.builder()
                            .item(item)
                            .location(location)
                            .quantity(quantity)
                            .build();
                    inventories.add(inventory);
                }
            }
            inventoryRepository.saveAll(inventories);
            System.out.println("--- " + inventories.size() + "개의 재고(Inventory) 데이터가 성공적으로 초기화되었습니다. ---");
        }
    }

    private String generateSequentialCode(int index) {
        final int BASE = 26; // 알파벳 개수

        // 1. 첫 번째 자리 (가장 높은 자리)
        char char1 = (char) ('A' + (index / (BASE * BASE)) % BASE);

        // 2. 두 번째 자리
        char char2 = (char) ('A' + (index / BASE) % BASE);

        // 3. 세 번째 자리 (가장 낮은 자리)
        char char3 = (char) ('A' + index % BASE);

        // AAA, AAB, ... ZZB, ZZC 순서로 60개(index 0 ~ 59)만 생성되므로,
        // 첫 번째 자리는 항상 'A'가 됩니다.

        return String.valueOf(char1) + char2 + char3;
    }

    private int generateRandomPrice() {
        // ThreadLocalRandom.current().nextInt(min, max + 1)
        // 두 번째 인자(bound)는 배타적이므로 +1을 해줘야 50000까지 포함됩니다.
        return ThreadLocalRandom.current().nextInt(MIN_PRICE, MAX_PRICE + 1);
    }
}