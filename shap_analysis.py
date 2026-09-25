"""
SHAP (SHapley Additive exPlanations) Analysis for Fraud Detection Model
=========================================================================

This script provides comprehensive model interpretability through SHAP values.
It generates multiple visualizations to explain:
- Global feature importance (which features matter most overall)
- Local feature importance (why specific predictions were made)
- Feature interactions and dependencies
- Individual prediction explanations

SHAP is based on game theory and provides theoretically sound explanations
for any machine learning model's predictions.

Usage:
    python shap_analysis.py
"""

from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import shap
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
import warnings
warnings.filterwarnings('ignore')

BASE_DIR = Path(__file__).resolve().parent

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 8)


class SHAPAnalyzer:
    """
    Comprehensive SHAP analysis for fraud detection models.
    """
    
    def __init__(self, model_path='fraud_model.pkl', data_path=None):
        """
        Initialize SHAP Analyzer
        
        Args:
            model_path: Path to saved fraud detection model
            data_path: Path to dataset for analysis
        """
        self.model = joblib.load(model_path)
        self.data = None
        self.X_test = None
        self.explainer = None
        self.shap_values = None
        
        if data_path:
            self.load_data(data_path)
    
    def load_data(self, data_path):
        """Load and preprocess data"""
        print("Loading data...")
        self.data = pd.read_csv(data_path)
        
        # Rename 'time' column if exists
        if 'time' in self.data.columns:
            self.data.rename(columns={'time': 'transaction_hour'}, inplace=True)
        
        # Prepare features
        X = self.data.drop(columns=['is_fraud', 'transaction_id'], errors='ignore')
        self.X_test = X.iloc[:1000]  # Use first 1000 samples for analysis
        print(f"✓ Data loaded: {self.X_test.shape[0]} samples, {self.X_test.shape[1]} features")
    
    def create_explainer(self):
        """Create SHAP TreeExplainer"""
        print("\nCreating SHAP Explainer...")
        self.explainer = shap.TreeExplainer(self.model)
        self.shap_values = self.explainer.shap_values(self.X_test)
        
        # Handle binary classification
        if isinstance(self.shap_values, list):
            self.shap_values = self.shap_values[1]  # Fraud class
        
        print("✓ SHAP Explainer created successfully")
        print(f"  Base Value (Expected Model Output): {self.explainer.expected_value[1]:.4f}")
    
    def plot_global_feature_importance(self):
        """SHAP Summary Plot - Bar Chart (Global Feature Importance)"""
        print("\n[1/6] Generating Global Feature Importance Plot...")
        plt.figure(figsize=(12, 8))
        shap.summary_plot(self.shap_values, self.X_test, plot_type="bar", show=False)
        plt.title("SHAP Summary Plot - Global Feature Importance\n(Average |SHAP value| per feature)", 
                  fontsize=14, fontweight='bold')
        plt.xlabel("Mean |SHAP value| (average impact on model output)", fontsize=11)
        plt.tight_layout()
        plt.savefig('shap_01_global_importance.png', dpi=300, bbox_inches='tight')
        print("  ✓ Saved: shap_01_global_importance.png")
        plt.close()
    
    def plot_feature_impact_scatter(self):
        """SHAP Summary Plot - Scatter (Feature Values vs Impact)"""
        print("[2/6] Generating Feature Impact Scatter Plot...")
        plt.figure(figsize=(12, 8))
        shap.summary_plot(self.shap_values, self.X_test, show=False)
        plt.title("SHAP Impact Plot - Feature Values vs Model Impact\n"
                  "(Each dot is a sample; color shows feature value: low=blue, high=red)",
                  fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig('shap_02_impact_scatter.png', dpi=300, bbox_inches='tight')
        print("  ✓ Saved: shap_02_impact_scatter.png")
        plt.close()
    
    def plot_dependence_plots(self, top_n=4):
        """SHAP Dependence Plots for Top Features"""
        print(f"[3/6] Generating Top {top_n} Feature Dependence Plots...")
        feature_names = self.X_test.columns.tolist()
        
        # Get top features by mean absolute SHAP value
        mean_abs_shap = np.abs(self.shap_values).mean(axis=0)
        top_features_idx = np.argsort(mean_abs_shap)[-top_n:][::-1]
        
        for rank, feature_idx in enumerate(top_features_idx, 1):
            plt.figure(figsize=(10, 6))
            shap.dependence_plot(feature_idx, self.shap_values, self.X_test, show=False)
            plt.title(f"Feature {rank}: {feature_names[feature_idx]}\n"
                      f"How this feature value affects fraud prediction",
                      fontsize=12, fontweight='bold')
            plt.tight_layout()
            plt.savefig(f'shap_03_dependence_{rank}_{feature_names[feature_idx]}.png', 
                        dpi=300, bbox_inches='tight')
            print(f"  ✓ Saved: shap_03_dependence_{rank}_{feature_names[feature_idx]}.png")
            plt.close()
    
    def plot_force_plots(self):
        """SHAP Force Plots for Sample Predictions"""
        print("[4/6] Generating Force Plots (Local Explanations)...")
        feature_names = self.X_test.columns.tolist()
        
        # Select diverse samples
        sample_indices = [0, len(self.X_test)//4, len(self.X_test)//2, 
                         3*len(self.X_test)//4, len(self.X_test)-1]
        
        for i, idx in enumerate(sample_indices[:3], 1):  # Save first 3
            plt.figure(figsize=(14, 4))
            shap.force_plot(self.explainer.expected_value[1],
                           self.shap_values[idx],
                           self.X_test.iloc[idx],
                           feature_names=feature_names,
                           show=False,
                           matplotlib=True)
            plt.title(f"Sample {i+1}: Individual Prediction Explanation\n"
                     f"(Red features increase fraud probability, Blue decrease it)",
                     fontsize=12, fontweight='bold')
            plt.tight_layout()
            plt.savefig(f'shap_04_force_sample_{i}.png', dpi=300, bbox_inches='tight')
            print(f"  ✓ Saved: shap_04_force_sample_{i}.png")
            plt.close()
    
    def plot_waterfall_plots(self):
        """SHAP Waterfall Plots - Local Explanations"""
        print("[5/6] Generating Waterfall Plots (Prediction Breakdown)...")
        feature_names = self.X_test.columns.tolist()
        
        # Plot for first 2 samples
        for i in range(min(2, len(self.X_test))):
            plt.figure(figsize=(12, 8))
            explanation = shap.Explanation(
                values=self.shap_values[i],
                base_values=self.explainer.expected_value[1],
                data=self.X_test.iloc[i].values,
                feature_names=feature_names
            )
            shap.plots.waterfall(explanation, show=False)
            plt.title(f"Sample {i+1}: Waterfall Plot\n"
                     f"How each feature contributes to fraud prediction",
                     fontsize=12, fontweight='bold')
            plt.tight_layout()
            plt.savefig(f'shap_05_waterfall_sample_{i+1}.png', dpi=300, bbox_inches='tight')
            print(f"  ✓ Saved: shap_05_waterfall_sample_{i+1}.png")
            plt.close()
    
    def plot_decision_plot(self):
        """SHAP Decision Plot - How Predictions Are Made"""
        print("[6/6] Generating Decision Plot...")
        plt.figure(figsize=(14, 8))
        shap.decision_plot(self.explainer.expected_value[1],
                          self.shap_values[:100],
                          self.X_test.iloc[:100],
                          show=False)
        plt.title("SHAP Decision Plot\n"
                 f"How model moves from base value to prediction (100 samples shown)",
                 fontsize=12, fontweight='bold')
        plt.tight_layout()
        plt.savefig('shap_06_decision_plot.png', dpi=300, bbox_inches='tight')
        print("  ✓ Saved: shap_06_decision_plot.png")
        plt.close()
    
    def print_feature_statistics(self):
        """Print SHAP value statistics"""
        print("\n" + "="*70)
        print("SHAP VALUE STATISTICS")
        print("="*70)
        
        feature_names = self.X_test.columns.tolist()
        mean_abs_shap = np.abs(self.shap_values).mean(axis=0)
        
        # Sort by importance
        sorted_idx = np.argsort(mean_abs_shap)[::-1]
        
        print("\nFeature Importance (by mean |SHAP value|):")
        print("-" * 70)
        print(f"{'Rank':<6} {'Feature':<30} {'Mean |SHAP|':<15} {'Std Dev':<15}")
        print("-" * 70)
        
        for rank, idx in enumerate(sorted_idx[:10], 1):
            mean_val = mean_abs_shap[idx]
            std_val = np.std(np.abs(self.shap_values[:, idx]))
            print(f"{rank:<6} {feature_names[idx]:<30} {mean_val:<15.4f} {std_val:<15.4f}")
        
        print("-" * 70)
        print(f"\nBase Value (Model's Average Output): {self.explainer.expected_value[1]:.4f}")
        print("  → This is the model's baseline fraud probability when given an average transaction")
        print("\nInterpretation Guide:")
        print("  • Positive SHAP values → Push prediction toward FRAUD")
        print("  • Negative SHAP values → Push prediction toward LEGITIMATE")
        print("  • Larger SHAP values → Stronger influence on prediction")
        print("="*70 + "\n")
    
    def run_full_analysis(self):
        """Execute complete SHAP analysis"""
        print("\n" + "="*70)
        print("SHAP ANALYSIS FOR FRAUD DETECTION MODEL")
        print("="*70 + "\n")
        
        self.create_explainer()
        self.plot_global_feature_importance()
        self.plot_feature_impact_scatter()
        self.plot_dependence_plots()
        self.plot_force_plots()
        self.plot_waterfall_plots()
        self.plot_decision_plot()
        self.print_feature_statistics()
        
        print("✓ SHAP Analysis Complete!")
        print("  All visualizations saved as PNG files in current directory")


if __name__ == "__main__":
    analyzer = SHAPAnalyzer(
        model_path='fraud_model.pkl',
        data_path=BASE_DIR / 'fraud_dataset_500.csv'
    )
    analyzer.run_full_analysis()
