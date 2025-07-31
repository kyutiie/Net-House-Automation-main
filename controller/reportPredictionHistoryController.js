exports.predictionHistoryReport = async (req, res) => {
    try {
        // You can fetch prediction history data here if needed
        res.render('admin/report-prediction-history', { user: req.session.user });
    } catch (error) {
        console.error('Error rendering prediction history report:', error);
        res.render('admin/report-prediction-history', { user: req.session.user, error: 'Failed to load prediction history report.' });
    }
}; 