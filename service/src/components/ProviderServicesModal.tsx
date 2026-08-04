import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { CATEGORY_TAXONOMY, Category, SubCategory } from '../data/categoriesData';
import { sharedStore } from '../../../customer/src/data/sharedData';

interface Props {
  visible: boolean;
  proId: string;
  onClose: () => void;
}

export function ProviderServicesModal({ visible, proId, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORY_TAXONOMY[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>(
    CATEGORY_TAXONOMY[0].subcategories[0]
  );
  const [serviceTitle, setServiceTitle] = useState('');
  const [price, setPrice] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('45 mins');

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat.subcategories.length > 0) {
      setSelectedSubCategory(cat.subcategories[0]);
      setServiceTitle(cat.subcategories[0].name);
    }
  };

  const handleSubCategorySelect = (sub: SubCategory) => {
    setSelectedSubCategory(sub);
    setServiceTitle(sub.name);
  };

  const handleSaveService = () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid rate/price for your service (e.g. 499)');
      return;
    }

    const titleToSave = serviceTitle.trim() || selectedSubCategory.name;
    const requirementsToSave = requirements.trim() || 'No special customer requirement';

    sharedStore.addProviderService(proId, {
      title: titleToSave,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      subcategoryId: selectedSubCategory.id,
      subcategoryName: selectedSubCategory.name,
      price: parsedPrice,
      requirements: requirementsToSave,
      duration: duration.trim() || '45 mins',
      isAvailable: true,
    });

    Alert.alert(
      'Service Listed Successfully! 🎉',
      `Your rate ₹${parsedPrice} for "${titleToSave}" under "${selectedSubCategory.name}" is now live for nearby customers.`
    );

    // Reset inputs & close
    setPrice('');
    setRequirements('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Service & Set Rates</Text>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.white} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Step 1: Select Category */}
          <Text style={styles.stepLabel}>1. SELECT SERVICE CATEGORY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORY_TAXONOMY.map((cat) => {
              const isSelected = cat.id === selectedCategory.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Ionicons
                    name={(cat.icon as any) || 'grid'}
                    size={16}
                    color={isSelected ? colors.white : colors.purpleBright}
                  />
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Step 2: Select Subcategory */}
          <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>
            2. SELECT SUBCATEGORY
          </Text>
          <View style={styles.subGrid}>
            {selectedCategory.subcategories.map((sub) => {
              const isSelected = sub.id === selectedSubCategory.id;
              return (
                <Pressable
                  key={sub.id}
                  style={[styles.subCard, isSelected && styles.subCardActive]}
                  onPress={() => handleSubCategorySelect(sub)}
                >
                  <View style={styles.subHeader}>
                    <Text style={[styles.subTitle, isSelected && styles.subTitleActive]}>
                      {sub.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.purpleBright} />
                    )}
                  </View>
                  {sub.description && (
                    <Text style={styles.subDesc} numberOfLines={2}>
                      {sub.description}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Step 3: Custom Rates & Requirements */}
          <Text style={[styles.stepLabel, { marginTop: spacing.xl }]}>
            3. SERVICE DETAILS & YOUR CUSTOM RATE
          </Text>

          {/* Service Title */}
          <Text style={styles.inputLabel}>Service Title</Text>
          <TextInput
            style={styles.input}
            value={serviceTitle}
            onChangeText={setServiceTitle}
            placeholder="e.g. Deluxe Spa Manicure & Pedicure"
            placeholderTextColor={colors.textMuted}
          />

          {/* Pricing Input */}
          <Text style={styles.inputLabel}>Your Custom Rate / Price (₹)</Text>
          <View style={styles.priceInputRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="499"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Requirements Input */}
          <Text style={styles.inputLabel}>
            Customer Requirements / Prerequisites (Mandatory details)
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={3}
            placeholder="e.g. Customer must provide 2 clean towels, warm water bucket, and electrical plug socket nearby."
            placeholderTextColor={colors.textMuted}
          />

          {/* Duration */}
          <Text style={styles.inputLabel}>Estimated Duration</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 45 mins"
            placeholderTextColor={colors.textMuted}
          />

          {/* Submit CTA */}
          <Pressable style={styles.saveBtn} onPress={handleSaveService}>
            <Ionicons name="sparkles" size={18} color={colors.white} />
            <Text style={styles.saveBtnText}>Publish Service & Rates</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: spacing.xl,
  },
  stepLabel: {
    color: colors.purpleBright,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  chipScroll: {
    gap: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purpleBright,
  },
  catChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: colors.white,
  },
  subGrid: {
    gap: spacing.sm,
  },
  subCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subCardActive: {
    borderColor: colors.purpleBright,
    backgroundColor: colors.purpleSoft,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  subTitleActive: {
    color: colors.purpleBright,
  },
  subDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  inputLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.purple,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    color: colors.purpleBright,
    fontSize: 22,
    fontWeight: '900',
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    paddingVertical: spacing.md,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.purple,
    paddingVertical: spacing.lg,
    borderRadius: radius.full,
    marginTop: spacing.xxl,
    elevation: 4,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
