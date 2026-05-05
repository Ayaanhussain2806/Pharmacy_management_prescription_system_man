package com.pharmacy.controller;

import com.pharmacy.dto.ApiResponse;
import com.pharmacy.dto.CartItemResponse;
import com.pharmacy.model.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartItems(getUserId(userDetails)));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return ResponseEntity.ok(cartService.addToCart(getUserId(userDetails), medicineId, quantity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        return ResponseEntity.ok(cartService.updateCartItem(getUserId(userDetails), id, request.get("quantity")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        cartService.removeFromCart(getUserId(userDetails), id);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(getUserId(userDetails));
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared"));
    }
}
